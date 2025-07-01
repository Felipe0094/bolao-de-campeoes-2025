import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Calendar, Ruler, Activity, Camera, Plus } from 'lucide-react';
import { usePatient } from '@/hooks/usePatients';
import { usePatientMeasurements } from '@/hooks/useMeasurements';
import { useBodyPhotos } from '@/hooks/useBodyPhotos';
import ProfilePhotoUploader from './ProfilePhotoUploader';
import BodyPhotoUploader from './BodyPhotoUploader';
import BodyPhotoGallery from './BodyPhotoGallery';
import MeasurementForm from './MeasurementForm';
import PatientTimeline from './PatientTimeline';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

// Função utilitária para cálculo de métricas de saúde e risco
function calculateHealthMetrics({
  waist_cm, hip_cm, height_cm, weight_kg, bmi, muscle_segments, body_fat_percent, visceral_fat_rating, albumin_g_per_L, triglycerides, hdl, gender, muscle_percent
}: {
  waist_cm?: number,
  hip_cm?: number,
  height_cm?: number,
  weight_kg?: number,
  bmi?: number,
  muscle_segments?: { arms?: number, legs?: number, trunk?: number },
  body_fat_percent?: number,
  visceral_fat_rating?: number,
  albumin_g_per_L?: number,
  triglycerides?: number,
  hdl?: number,
  gender?: number,
  muscle_percent?: number
}) {
  const height_m = height_cm ? height_cm / 100 : undefined;
  const whtR = waist_cm && height_cm ? waist_cm / height_cm : undefined;
  const bri = (waist_cm && height_cm && waist_cm > 0 && height_cm > 0) ? (() => {
    const wc = waist_cm;
    const h = height_cm;
    const denominator = Math.PI * h;
    if (denominator === 0) return undefined;
    const ratio = wc / denominator;
    const insideSqrt = 1 - Math.pow(ratio, 2);
    if (ratio < 0 || ratio > 1 || insideSqrt < 0) return undefined;
    const val = 364.2 - 365.5 * Math.sqrt(insideSqrt);
    return isNaN(val) ? undefined : val;
  })() : undefined;
  const absi = waist_cm && height_m && bmi ? (waist_cm / 100) / (Math.pow(bmi, 2/3) * Math.pow(height_m, 0.5)) : undefined;
  const whr = waist_cm && hip_cm ? waist_cm / hip_cm : undefined;
  const bai = hip_cm && height_m ? (hip_cm / Math.pow(height_m, 1.5)) - 18 : undefined;
  let smi = undefined;
  if (weight_kg !== undefined && muscle_percent !== undefined && height_m) {
    const massa_muscular_kg = weight_kg * (muscle_percent / 100);
    smi = massa_muscular_kg / (height_m ** 2);
  }
  const lms = muscle_segments && weight_kg ? (muscle_segments.legs ?? 0) / weight_kg * 100 : undefined;
  let ffmi = undefined;
  if (weight_kg !== undefined && body_fat_percent !== undefined && height_m) {
    const ffm = weight_kg * (1 - (body_fat_percent / 100));
    ffmi = ffm / (height_m ** 2);
  }
  const gnri = albumin_g_per_L && weight_kg && height_cm ? (1.489 * albumin_g_per_L) + (41.7 * weight_kg / (22 * (height_m! ** 2))) : undefined;
  // Limiares de risco de sarcopenia
  let sarcopenia = false;
  if (smi !== undefined && gender !== undefined) {
    if (gender === 1) { // Homem
      sarcopenia = smi < 7.0;
    } else { // Mulher
      sarcopenia = smi < 5.7;
    }
  }
  // Riscos
  const risks = {
    cardiovascular: whtR !== undefined && whtR > 0.5,
    magreza: bri !== undefined && bri < 3.4,
    obesidade_visceral: bri !== undefined && bri > 6.9,
    sarcopenia,
    metabolic_syndrome: visceral_fat_rating !== undefined && visceral_fat_rating > 12
  };
  return { whtR, bri, absi, whr, bai, gnri, smi, lms, ffmi, risks };
}

// Função utilitária para renderizar régua colorida
function RiskGauge({ value, min, max, greenMin, greenMax, yellowMin, yellowMax, redMin, redMax, step = 0.01, labelMin, labelMax, unit }) {
  if (value === undefined || isNaN(value)) return null;
  // Clamp value
  const clamped = Math.max(min, Math.min(max, value));
  const percent = ((clamped - min) / (max - min)) * 100;
  // Gradiente apenas do amarelo para o vermelho
  // Amarelo: #FFE066, Vermelho: #FF6B81
  let bg = 'from-[#FFE066] to-[#FF6B81]';
  return (
    <div className="mt-2">
      <div className={`relative h-3 rounded-full bg-gradient-to-r ${bg}`} style={{width: '100%'}}>
        <div style={{ left: `calc(${percent}% - 8px)` }} className="absolute top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{labelMin ?? min}</span>
        <span>{labelMax ?? max} {unit}</span>
      </div>
    </div>
  );
}

function useSupabaseImage(path: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!path) return;
    let revoked = false;
    supabase.storage.from('patient-photos').download(path).then(({ data, error }) => {
      if (data && !revoked) {
        const blobUrl = URL.createObjectURL(data);
        setUrl(blobUrl);
        // Clean up
        return () => {
          revoked = true;
          URL.revokeObjectURL(blobUrl);
        };
      }
    });
  }, [path]);
  return url;
}

function getProfilePhotoUrl(profile_photo_url: string | null | undefined) {
  if (!profile_photo_url) return undefined;
  if (profile_photo_url.startsWith('http')) return profile_photo_url;
  return `https://deoxrdicmklsgaqzsybm.supabase.co/storage/v1/object/public/patient-photos/${profile_photo_url}`;
}

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: patient, isLoading: patientLoading, error: patientError } = usePatient(id!);
  const { scaleMeasurements, manualMeasurements, isLoading: measurementsLoading } = usePatientMeasurements(id!);
  const { data: bodyPhotos = [] } = useBodyPhotos(id!);
  const [editingManual, setEditingManual] = useState<any | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  // Foto de perfil: garantir ordem dos hooks e valor estável
  const profilePhotoPath = patient && patient.profile_photo_url && !patient.profile_photo_url.startsWith('http')
    ? patient.profile_photo_url
    : null;
  const supabaseProfilePhotoBlobUrl = useSupabaseImage(profilePhotoPath);
  const publicProfilePhotoUrl = patient && patient.profile_photo_url && patient.profile_photo_url.startsWith('http')
    ? patient.profile_photo_url
    : null;

  // NOVO: flags para loading/erro
  const isLoading = patientLoading;
  const isError = patientError || !patient;

  const getAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Number(age);
  };

  const getGenderText = (gender: number) => {
    return gender === 0 ? 'Feminino' : 'Masculino';
  };

  const getActivityLevelText = (level: number) => {
    const levels = ['Sedentário', 'Levemente ativo', 'Moderadamente ativo', 'Muito ativo', 'Extremamente ativo'];
    return levels[level] || 'Não informado';
  };

  const latestMeasurement = scaleMeasurements[0];

  // Prepare timeline data - combine both manual and scale measurements
  const combinedMeasurements = [
    ...scaleMeasurements.map(measurement => ({
      date: measurement.timestamp,
      type: 'scale' as const,
      data: {
        weight: Number(measurement.weight) || 0,
        bmi: Number(measurement.bmi) || 0,
        bodyFat: Number(measurement.body_fat_percent) || 0,
        muscle: Number(measurement.muscle_mass_percent_total) || 0,
        water: Number(measurement.water_percent) || 0,
        visceralFat: Number(measurement.visceral_fat_rating) || 0,
        bone: Number(measurement.bone_mass_kg) || 0
      }
    })),
    ...manualMeasurements.map(measurement => {
      const data: any = {};
      if (measurement.waist_cm) data.waist = Number(measurement.waist_cm);
      if (measurement.abdomen_cm) data.abdomen = Number(measurement.abdomen_cm);
      if (measurement.arm_right_cm) data.arm_right = Number(measurement.arm_right_cm);
      if (measurement.arm_left_cm) data.arm_left = Number(measurement.arm_left_cm);
      if (measurement.thorax_cm) data.thorax = Number(measurement.thorax_cm);
      if (measurement.hip_cm) data.hip = Number(measurement.hip_cm);
      if (measurement.thigh_right_cm) data.thigh_right = Number(measurement.thigh_right_cm);
      if (measurement.thigh_left_cm) data.thigh_left = Number(measurement.thigh_left_cm);
      if (measurement.calf_right_cm) data.calf_right = Number(measurement.calf_right_cm);
      if (measurement.calf_left_cm) data.calf_left = Number(measurement.calf_left_cm);
      if (measurement.notes) data.observations = measurement.notes;
      return {
        id: measurement.id,
        date: measurement.timestamp,
        type: 'manual' as const,
        data
      };
    })
  ];

  const handleDeleteManual = async (measurement: any) => {
    if (measurement.type === 'manual' && measurement.id) {
      const { error } = await supabase
        .from('manual_measurements')
        .delete()
        .eq('id', measurement.id);
      
      if (error) {
        alert('Erro ao excluir medição: ' + error.message);
        return;
      }
      
      queryClient.invalidateQueries({ queryKey: ['manual-measurements', id] });
      alert('Medição excluída com sucesso!');
    }
  };

  // Montar dados para o gráfico de evolução
  const chartData = React.useMemo(() => {
    return scaleMeasurements
      .filter(m => m.timestamp)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(m => ({
        date: m.timestamp ? new Date(m.timestamp).toLocaleDateString('pt-BR') : '',
        weight: Number(m.weight) || null,
        bodyFat: Number(m.body_fat_percent) || null,
        muscle: Number(m.muscle_mass_percent_total) || null,
      }));
  }, [scaleMeasurements]);

  const profilePhotoBlobUrl = useSupabaseImage(patient && patient.profile_photo_url ? (
    patient.profile_photo_url.startsWith('http')
      ? patient.profile_photo_url.replace('https://deoxrdicmklsgaqzsybm.supabase.co/storage/v1/object/public/patient-photos/', '')
      : patient.profile_photo_url
  ) : null);

  // RENDER PRINCIPAL
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Erro ao carregar dados do paciente</div>
          <button 
            onClick={() => window.location.reload()}
            className="text-green-600 hover:text-green-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Patient Header */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start space-x-6">
              <div className="relative">
                {patient && patient.profile_photo_url ? (
                  <img
                    src={profilePhotoBlobUrl}
                    alt={patient.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2">
                  <ProfilePhotoUploader patientId={patient.id} />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{patient.name}</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{getAge(patient.birth_date)} anos</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{getGenderText(patient.gender)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Ruler className="h-4 w-4" />
                    <span>{patient.height_cm} cm</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Activity className="h-4 w-4" />
                    <span>{getActivityLevelText(patient.activity_level)}</span>
                  </div>
                </div>
                
                {patient.email && (
                  <p className="text-gray-600 mt-2">{patient.email}</p>
                )}
                
                {patient.athlete_mode && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-2">
                    Modo Atleta
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Evolução Gráfica */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Evolução Gráfica</h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} width={40} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} width={40} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="weight" name="Peso (kg)" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="bodyFat" name="% Gordura" stroke="#f59e42" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="muscle" name="% Músculo" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Measurements */}
          {latestMeasurement && (
            <>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Última Medição</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{Number(latestMeasurement.weight).toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Peso (kg)</p>
                </div>
                {latestMeasurement.bmi && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{Number(latestMeasurement.bmi).toFixed(1)}</p>
                    <p className="text-sm text-gray-600">IMC</p>
                  </div>
                )}
                {latestMeasurement.body_fat_percent && (
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{Number(latestMeasurement.body_fat_percent).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Gordura</p>
                  </div>
                )}
                {latestMeasurement.muscle_mass_percent_total && (
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{Number(latestMeasurement.muscle_mass_percent_total).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Músculo</p>
                  </div>
                )}
                {latestMeasurement.water_percent && (
                  <div className="text-center p-3 bg-cyan-50 rounded-lg">
                    <p className="text-2xl font-bold text-cyan-600">{Number(latestMeasurement.water_percent).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Água</p>
                  </div>
                )}
                {latestMeasurement.visceral_fat_rating !== undefined && (
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{Number(latestMeasurement.visceral_fat_rating)}</p>
                    <p className="text-sm text-gray-600">G. Visceral <span className={Number(latestMeasurement.visceral_fat_rating) >= 13 ? 'text-red-600 font-bold' : 'text-green-600'}>({Number(latestMeasurement.visceral_fat_rating) >= 13 ? 'Excessivo' : 'Saudável'})</span></p>
                  </div>
                )}
              </div>

              {/* Saúde metabólica, hidratação, óssea, DCI, idade metabólica */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-[#f0fdf4] rounded-lg p-3">
                  <span className="font-bold">Idade Metabólica:</span> {latestMeasurement.metabolic_age !== undefined ? Number(latestMeasurement.metabolic_age) : '-'} {patient.birth_date && latestMeasurement.metabolic_age !== undefined && !isNaN(Number(latestMeasurement.metabolic_age)) && (
                    <span className={Number(latestMeasurement.metabolic_age) > getAge(patient.birth_date) ? 'text-red-600 font-bold' : 'text-green-600'}>
                      ({Number(latestMeasurement.metabolic_age) > getAge(patient.birth_date) ? 'Elevada' : 'Ok'})
                    </span>
                  )}
                </div>
                <div className="bg-[#f0fdf4] rounded-lg p-3">
                  <span className="font-bold">Água Total:</span> {latestMeasurement.water_percent ?? '-'}%
                </div>
                <div className="bg-[#f0fdf4] rounded-lg p-3">
                  <span className="font-bold">Massa Óssea:</span> {latestMeasurement.bone_mass_kg ?? '-'} kg
                </div>
                <div className="bg-[#f0fdf4] rounded-lg p-3">
                  <span className="font-bold">DCI:</span> {latestMeasurement.daily_calorie_maintenance ?? '-'} kcal
                </div>
              </div>

              {(() => {
                const lastManual = manualMeasurements && manualMeasurements.length > 0 ? manualMeasurements[0] : undefined;
                if (!lastManual) return null;
                return (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-[#f0fcf4] rounded-lg p-3">
                      <span className="font-bold">Cintura:</span> {lastManual.waist_cm ? Number(lastManual.waist_cm) + ' cm' : '-'}
                    </div>
                    <div className="bg-[#f0fcf4] rounded-lg p-3">
                      <span className="font-bold">Abdômen:</span> {lastManual.abdomen_cm ? Number(lastManual.abdomen_cm) + ' cm' : '-'}
                    </div>
                    <div className="bg-[#f0fcf4] rounded-lg p-3">
                      <span className="font-bold">Tórax:</span> {lastManual.thorax_cm ? Number(lastManual.thorax_cm) + ' cm' : '-'}
                    </div>
                    <div className="bg-[#f0fcf4] rounded-lg p-3">
                      <span className="font-bold">Quadril:</span> {lastManual.hip_cm ? Number(lastManual.hip_cm) + ' cm' : '-'}
                    </div>
                  </div>
                );
              })()}

              {/* Análise Segmentada */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Análise Segmentada</h3>
                {/* Gordura segmentada */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-2">
                  <div className="bg-orange-50 rounded-lg p-3">
                    <span className="font-bold">Gordura Braço Dir.:</span> {latestMeasurement.fat_arm_right ?? '-'}%
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <span className="font-bold">Gordura Braço Esq.:</span> {latestMeasurement.fat_arm_left ?? '-'}%
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <span className="font-bold">Gordura Perna Dir.:</span> {latestMeasurement.fat_leg_right ?? '-'}%
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <span className="font-bold">Gordura Perna Esq.:</span> {latestMeasurement.fat_leg_left ?? '-'}%
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <span className="font-bold">Gordura Tronco:</span> {latestMeasurement.fat_trunk ?? '-'}%
                  </div>
                </div>
                {/* Músculo segmentado */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-2">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <span className="font-bold">Músculo Braço Dir.:</span> {latestMeasurement.muscle_arm_right ?? '-'}%
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <span className="font-bold">Músculo Braço Esq.:</span> {latestMeasurement.muscle_arm_left ?? '-'}%
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <span className="font-bold">Músculo Perna Dir.:</span> {latestMeasurement.muscle_leg_right ?? '-'}%
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <span className="font-bold">Músculo Perna Esq.:</span> {latestMeasurement.muscle_leg_left ?? '-'}%
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <span className="font-bold">Músculo Tronco:</span> {latestMeasurement.muscle_trunk ?? '-'}%
                  </div>
                </div>
              </div>

              {/* Métricas de Risco e Saúde Avançadas */}
              {(() => {
                // Buscar última medição manual válida para cintura
                const latestManualWithWaist = manualMeasurements.find(m => Number(m.waist_cm) > 0);
                const latestManualWithWaistAndHip = manualMeasurements.find(m => m.waist_cm && !isNaN(Number(m.waist_cm)) && m.hip_cm && !isNaN(Number(m.hip_cm)));
                const waist = latestManualWithWaist ? Number(latestManualWithWaist.waist_cm) : undefined;
                const hip = latestManualWithWaistAndHip ? Number(latestManualWithWaistAndHip.hip_cm) : undefined;
                const height = patient.height_cm ? Number(patient.height_cm) : undefined;
                const weight = latestMeasurement.weight ? Number(latestMeasurement.weight) : undefined;
                const bmi = latestMeasurement.bmi ? Number(latestMeasurement.bmi) : undefined;
                const gender = patient.gender;
                const muscle_segments = {
                  arms: (latestMeasurement.muscle_arm_right ?? 0) + (latestMeasurement.muscle_arm_left ?? 0),
                  legs: (latestMeasurement.muscle_leg_right ?? 0) + (latestMeasurement.muscle_leg_left ?? 0),
                  trunk: latestMeasurement.muscle_trunk ?? 0
                };
                const body_fat_percent = latestMeasurement.body_fat_percent ? Number(latestMeasurement.body_fat_percent) : undefined;
                const visceral_fat_rating = latestMeasurement.visceral_fat_rating ? Number(latestMeasurement.visceral_fat_rating) : undefined;
                // Forçar parse para garantir tipo Number e ponto decimal
                const waistNum = waist ? Number(String(waist).replace(',', '.')) : undefined;
                const heightNum = height ? Number(String(height).replace(',', '.')) : undefined;
                // Chamar função de cálculo
                const metrics = calculateHealthMetrics({
                  waist_cm: waistNum,
                  hip_cm: hip,
                  height_cm: heightNum,
                  weight_kg: weight,
                  bmi,
                  muscle_segments,
                  body_fat_percent,
                  visceral_fat_rating,
                  gender,
                  muscle_percent: latestMeasurement.muscle_mass_percent_total ? Number(latestMeasurement.muscle_mass_percent_total) : undefined
                });
                return (
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Métricas de Risco e Saúde</h2>
                    <TooltipProvider>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                        <div className="bg-[#f9fafb] rounded-lg p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-bold cursor-help">WHtR:</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Circunferência da cintura dividida pela altura. Acima de 0,5 indica risco aumentado de doenças cardiovasculares e metabólicas.
                            </TooltipContent>
                          </Tooltip>
                          {metrics.whtR !== undefined ? metrics.whtR.toFixed(2) : '-'} {metrics.risks.cardiovascular && <span className="text-red-600 font-bold">(Risco ↑)</span>}
                          <div className="text-xs text-gray-500">Relação Cintura-Altura</div>
                          <RiskGauge value={metrics.whtR} min={0.3} max={0.7} greenMin={0.4} greenMax={0.5} yellowMin={0.5} yellowMax={0.55} redMin={0.55} redMax={0.7} labelMin="0.3" labelMax="0.7" unit="" />
                        </div>
                        <div className="bg-[#f9fafb] rounded-lg p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-bold cursor-help">BRI:</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Avalia formato corporal usando cintura e altura. Valores ≥ 6,9 estão associados a até 49% de aumento da mortalidade.
                            </TooltipContent>
                          </Tooltip>
                          {metrics.bri !== undefined && !isNaN(metrics.bri) ? metrics.bri.toFixed(2) : '-'}
                          {metrics.risks.magreza && <span className="text-yellow-600 font-bold ml-1">(Magreza/Sarcopenia)</span>}
                          {metrics.risks.obesidade_visceral && <span className="text-red-600 font-bold ml-1">(Obesidade Visceral)</span>}
                          <div className="text-xs text-gray-500">Índice de Redondeza Corporal</div>
                          <RiskGauge value={metrics.bri} min={2} max={8} greenMin={3.4} greenMax={6.9} yellowMin={2} yellowMax={3.4} redMin={6.9} redMax={8} labelMin="2" labelMax="8" unit="" />
                        </div>
                        <div className="bg-[#f9fafb] rounded-lg p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-bold cursor-help">ABSI:</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Ajusta circunferência da cintura ao IMC e altura. Valores mais altos indicam maior risco de mortalidade.
                            </TooltipContent>
                          </Tooltip>
                          {metrics.absi !== undefined ? metrics.absi.toFixed(4) : '-'}
                          <div className="text-xs text-gray-500">Índice de Forma Corporal Ajustado</div>
                          <RiskGauge value={metrics.absi} min={0.06} max={0.09} greenMin={0.07} greenMax={0.08} yellowMin={0.08} yellowMax={0.085} redMin={0.085} redMax={0.09} labelMin="0.06" labelMax="0.09" unit="" />
                        </div>
                        <div className="bg-[#f9fafb] rounded-lg p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-bold cursor-help">WHR:</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Cintura dividida pelo quadril. Valores {'>'} 0,85 (mulheres) ou {'>'} 0,90 (homens) indicam risco de doenças metabólicas e cardiovasculares.
                            </TooltipContent>
                          </Tooltip>
                          {metrics.whr !== undefined ? metrics.whr.toFixed(2) : '-'} {metrics.whr !== undefined && ((gender === 1 && metrics.whr >= 0.9) || (gender === 0 && metrics.whr >= 0.85)) && <span className="text-red-600 font-bold">(Risco ↑)</span>}
                          <div className="text-xs text-gray-500">Relação Cintura-Quadril</div>
                          <RiskGauge value={metrics.whr} min={0.6} max={1} greenMin={0.8} greenMax={0.9} yellowMin={0.9} yellowMax={1.0} redMin={1.0} redMax={1.2} labelMin="0.6" labelMax="1" unit="" />
                        </div>
                        <div className="bg-[#f9fafb] rounded-lg p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-bold cursor-help">BAI:</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Estima a gordura corporal usando circunferência do quadril e altura. Varia tipicamente entre 10% e 40%.
                            </TooltipContent>
                          </Tooltip>
                          {metrics.bai !== undefined ? metrics.bai.toFixed(2) : '-'}
                          <div className="text-xs text-gray-500">Índice de Adiposidade Corporal</div>
                          <RiskGauge value={metrics.bai} min={10} max={40} greenMin={18} greenMax={25} yellowMin={25} yellowMax={30} redMin={30} redMax={40} labelMin="10" labelMax="40" unit="%" />
                        </div>
                        <div className="bg-[#f9fafb] rounded-lg p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-bold cursor-help">SMI:</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Massa muscular esquelética ajustada à altura (kg/m²). Valores {'<'} 5,7 (♀) ou {'<'} 7,0 (♂) indicam risco de sarcopenia.
                            </TooltipContent>
                          </Tooltip>
                          {metrics.smi !== undefined ? metrics.smi.toFixed(2) : '-'} {metrics.risks.sarcopenia && <span className="text-red-600 font-bold">(Risco Sarcopenia)</span>}
                          <div className="text-xs text-gray-500">Índice Muscular Esquelético</div>
                          <RiskGauge value={metrics.smi} min={4} max={12} greenMin={7.5} greenMax={10} yellowMin={6.5} yellowMax={7.5} redMin={4} redMax={6.5} labelMin="4" labelMax="12" unit="" />
                        </div>
                        <div className="bg-[#f9fafb] rounded-lg p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-bold cursor-help">Leg Muscle Score:</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Avalia % de músculo nas pernas em relação ao peso corporal. Faixa típica entre 10 e 40.
                            </TooltipContent>
                          </Tooltip>
                          {metrics.lms !== undefined ? metrics.lms.toFixed(2) : '-'}
                          <div className="text-xs text-gray-500">Pontuação de Músculo de Perna</div>
                          <RiskGauge value={metrics.lms} min={10} max={40} greenMin={20} greenMax={30} yellowMin={15} yellowMax={20} redMin={10} redMax={15} labelMin="10" labelMax="40" unit="" />
                        </div>
                        <div className="bg-[#f9fafb] rounded-lg p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-bold cursor-help">FFMI:</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Massa livre de gordura ajustada à altura (kg/m²). Mulheres: ≥ 18 ótimo; homens: ≥ 20-22 ótimo.
                            </TooltipContent>
                          </Tooltip>
                          {metrics.ffmi !== undefined ? metrics.ffmi.toFixed(2) : '-'}
                          <div className="text-xs text-gray-500">Índice de Massa Livre de Gordura</div>
                          <RiskGauge value={metrics.ffmi} min={12} max={28} greenMin={17} greenMax={22} yellowMin={22} yellowMax={25} redMin={25} redMax={28} labelMin="12" labelMax="28" unit="" />
                        </div>
                      </div>
                    </TooltipProvider>
                  </div>
                );
              })()}
            </div>
            </>
          )}

          {/* Body Photos Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            {/* Modal do uploader */}
            {showUploader && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
                  <button
                    className="absolute top-2 right-2 bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-xs font-semibold"
                    onClick={() => setShowUploader(false)}
                  >
                    ✕ Fechar
                  </button>
                  <BodyPhotoUploader patientId={patient.id} onPhotosUploaded={() => setShowUploader(false)} />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Galeria de Progresso</h2>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                onClick={() => setShowUploader(true)}
              >
                Enviar Fotos
              </button>
            </div>
            <div className="w-full">
              <BodyPhotoGallery patientId={patient.id} />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <h2 className="text-xl font-semibold text-gray-800">Evolução</h2>
                <span className="text-gray-500 text-base md:text-lg mt-1 md:mt-0">Timeline de Medições</span>
              </div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                onClick={() => {
                  setEditingManual(null);
                  setShowManualForm(true);
                }}
              >
                Nova Medição Manual
              </button>
            </div>
            <PatientTimeline 
              measurements={combinedMeasurements} 
              onEditManual={(measurement) => {
                if (measurement.type === 'manual') {
                  setEditingManual(measurement);
                  setShowManualForm(true);
                }
              }}
              onDeleteManual={handleDeleteManual}
            />
          </div>

          {/* Add/Edit Manual Measurement Form Modal */}
          {showManualForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>{editingManual ? 'Editar Medição' : 'Nova Medição'}</span>
                  </h2>
                  <button
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-xs font-semibold"
                    onClick={() => {
                      setEditingManual(null);
                      setShowManualForm(false);
                    }}
                  >
                    ✕ Fechar
                  </button>
                </div>
                <MeasurementForm 
                  patientId={patient.id} 
                  editingManual={editingManual} 
                  onFinishEdit={() => {
                    setEditingManual(null);
                    setShowManualForm(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PatientProfile;
