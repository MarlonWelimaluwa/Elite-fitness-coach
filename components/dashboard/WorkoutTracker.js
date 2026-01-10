'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function WorkoutTracker({ user }) {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [formData, setFormData] = useState({
        workout_name: '',
        workout_date: new Date().toISOString().split('T')[0],
        duration_minutes: '',
        notes: '',
        exercises: [{ exercise_name: '', sets: '', reps: '', weight_kg: '' }],
    });

    useEffect(() => {
        fetchWorkouts();
    }, [user]);

    const fetchWorkouts = async () => {
        try {
            const { data: workoutsData, error: workoutsError } = await supabase
                .from('workouts')
                .select('*')
                .eq('user_id', user.id)
                .order('workout_date', { ascending: false });

            if (workoutsError) throw workoutsError;

            const workoutsWithExercises = await Promise.all(
                workoutsData.map(async (workout) => {
                    const { data: exercisesData } = await supabase
                        .from('exercises')
                        .select('*')
                        .eq('workout_id', workout.id);
                    return { ...workout, exercises: exercisesData || [] };
                })
            );

            setWorkouts(workoutsWithExercises);
        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingWorkout) {
                const { error: updateError } = await supabase
                    .from('workouts')
                    .update({
                        workout_name: formData.workout_name,
                        workout_date: formData.workout_date,
                        duration_minutes: parseInt(formData.duration_minutes),
                        notes: formData.notes,
                    })
                    .eq('id', editingWorkout.id);

                if (updateError) throw updateError;

                await supabase.from('exercises').delete().eq('workout_id', editingWorkout.id);

                const exercisesInsert = formData.exercises.map((ex) => ({
                    workout_id: editingWorkout.id,
                    exercise_name: ex.exercise_name,
                    sets: parseInt(ex.sets),
                    reps: parseInt(ex.reps),
                    weight_kg: parseFloat(ex.weight_kg) || null,
                }));

                const { error: exercisesError } = await supabase.from('exercises').insert(exercisesInsert);
                if (exercisesError) throw exercisesError;

                setEditingWorkout(null);
            } else {
                const { data: workoutData, error: workoutError } = await supabase
                    .from('workouts')
                    .insert([
                        {
                            user_id: user.id,
                            workout_name: formData.workout_name,
                            workout_date: formData.workout_date,
                            duration_minutes: parseInt(formData.duration_minutes),
                            notes: formData.notes,
                        },
                    ])
                    .select()
                    .single();

                if (workoutError) throw workoutError;

                const exercisesInsert = formData.exercises.map((ex) => ({
                    workout_id: workoutData.id,
                    exercise_name: ex.exercise_name,
                    sets: parseInt(ex.sets),
                    reps: parseInt(ex.reps),
                    weight_kg: parseFloat(ex.weight_kg) || null,
                }));

                const { error: exercisesError } = await supabase.from('exercises').insert(exercisesInsert);
                if (exercisesError) throw exercisesError;

                setShowAddForm(false);
            }

            setFormData({
                workout_name: '',
                workout_date: new Date().toISOString().split('T')[0],
                duration_minutes: '',
                notes: '',
                exercises: [{ exercise_name: '', sets: '', reps: '', weight_kg: '' }],
            });

            fetchWorkouts();
        } catch (error) {
            console.error('Error saving workout:', error);
            alert('Failed to save workout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (workoutId) => {
        if (!confirm('Are you sure you want to delete this workout?')) return;

        try {
            const { error } = await supabase.from('workouts').delete().eq('id', workoutId);
            if (error) throw error;
            fetchWorkouts();
        } catch (error) {
            console.error('Error deleting workout:', error);
            alert('Failed to delete workout. Please try again.');
        }
    };

    const handleEdit = (workout) => {
        setEditingWorkout(workout);
        setFormData({
            workout_name: workout.workout_name,
            workout_date: workout.workout_date,
            duration_minutes: workout.duration_minutes.toString(),
            notes: workout.notes || '',
            exercises: workout.exercises.map((ex) => ({
                exercise_name: ex.exercise_name,
                sets: ex.sets.toString(),
                reps: ex.reps.toString(),
                weight_kg: ex.weight_kg?.toString() || '',
            })),
        });
        setShowAddForm(true);
    };

    const addExercise = () => {
        setFormData({
            ...formData,
            exercises: [...formData.exercises, { exercise_name: '', sets: '', reps: '', weight_kg: '' }],
        });
    };

    const removeExercise = (index) => {
        setFormData({
            ...formData,
            exercises: formData.exercises.filter((_, i) => i !== index),
        });
    };

    const updateExercise = (index, field, value) => {
        const updatedExercises = [...formData.exercises];
        updatedExercises[index][field] = value;
        setFormData({ ...formData, exercises: updatedExercises });
    };

    if (loading && workouts.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#E8E9ED]">Workout Tracker</h1>
                <button onClick={() => { setShowAddForm(true); setEditingWorkout(null); }} className="btn-primary flex items-center whitespace-nowrap">
                    <Plus size={20} className="mr-2" />
                    <span>Log Workout</span>
                </button>
            </div>

            {showAddForm && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#E8E9ED]">{editingWorkout ? 'Edit Workout' : 'New Workout'}</h2>
                        <button onClick={() => { setShowAddForm(false); setEditingWorkout(null); }} className="text-[#9CA3AF] hover:text-[#E8E9ED]">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Workout Name</label>
                                <input type="text" value={formData.workout_name} onChange={(e) => setFormData({ ...formData, workout_name: e.target.value })} required className="input" placeholder="Chest & Triceps" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Date</label>
                                <input type="date" value={formData.workout_date} onChange={(e) => setFormData({ ...formData, workout_date: e.target.value })} required className="input" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Duration (minutes)</label>
                            <input type="number" value={formData.duration_minutes} onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })} required className="input" placeholder="60" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Notes</label>
                            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input resize-none" rows="3" placeholder="Felt strong today..."></textarea>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-[#E8E9ED]">Exercises</label>
                                <button type="button" onClick={addExercise} className="text-[#FF6B35] hover:text-[#E85A2A] text-sm font-medium flex items-center">
                                    <Plus size={16} className="mr-1" />
                                    Add Exercise
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.exercises.map((exercise, index) => (
                                    <div key={index} className="bg-[#1A1F3A] rounded-lg p-4 border border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div className="md:col-span-2">
                                                <input type="text" value={exercise.exercise_name} onChange={(e) => updateExercise(index, 'exercise_name', e.target.value)} required className="input" placeholder="Exercise name" />
                                            </div>
                                            <div>
                                                <input type="number" value={exercise.sets} onChange={(e) => updateExercise(index, 'sets', e.target.value)} required className="input" placeholder="Sets" />
                                            </div>
                                            <div>
                                                <input type="number" value={exercise.reps} onChange={(e) => updateExercise(index, 'reps', e.target.value)} required className="input" placeholder="Reps" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                                            <div className="md:col-span-3">
                                                <input type="number" step="0.5" value={exercise.weight_kg} onChange={(e) => updateExercise(index, 'weight_kg', e.target.value)} className="input" placeholder="Weight (kg) - optional" />
                                            </div>
                                            <div>
                                                <button type="button" onClick={() => removeExercise(index)} disabled={formData.exercises.length === 1} className="w-full btn-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center">
                                {loading ? <div className="spinner"></div> : <><Save size={20} className="mr-2" />{editingWorkout ? 'Update' : 'Save'} Workout</>}
                            </button>
                            <button type="button" onClick={() => { setShowAddForm(false); setEditingWorkout(null); }} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {workouts.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-[#9CA3AF] mb-4">No workouts logged yet. Start tracking your progress!</p>
                        <button onClick={() => setShowAddForm(true)} className="btn-primary">
                            Log Your First Workout
                        </button>
                    </div>
                ) : (
                    workouts.map((workout) => (
                        <div key={workout.id} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-[#E8E9ED]">{workout.workout_name}</h3>
                                    <p className="text-[#9CA3AF] text-sm">
                                        {new Date(workout.workout_date).toLocaleDateString()} • {workout.duration_minutes} minutes
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(workout)} className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(workout.id)} className="text-[#9CA3AF] hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {workout.notes && (
                                <p className="text-[#9CA3AF] text-sm mb-4 italic">{workout.notes}</p>
                            )}

                            <div className="space-y-2">
                                {workout.exercises?.map((exercise, idx) => (
                                    <div key={idx} className="bg-[#1A1F3A] rounded-lg p-3 flex items-center justify-between">
                                        <span className="text-[#E8E9ED] font-medium">{exercise.exercise_name}</span>
                                        <span className="text-[#9CA3AF] text-sm">
                      {exercise.sets} sets × {exercise.reps} reps
                                            {exercise.weight_kg && ` @ ${exercise.weight_kg} kg`}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}