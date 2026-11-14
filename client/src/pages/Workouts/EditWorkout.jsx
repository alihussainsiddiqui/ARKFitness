import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import workoutService from '../../services/workoutService';

const EditWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Strength');
  const [tags, setTags] = useState('');
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await workoutService.getWorkout(id);
        setTitle(data.title);
        setCategory(data.category);
        setTags(data.tags.join(', '));
        setExercises(data.exercises);
        setLoading(false);
      } catch (err) {
        setError('Failed to load workout data');
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  const handleAddExercise = () => setExercises([...exercises, { exerciseType: 'Strength', name: '', sets: '', reps: '', weight: '', duration: '', distance: '', notes: '' }]);
  const handleRemoveExercise = (index) => setExercises(exercises.filter((_, i) => i !== index));
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formattedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    try {
      await workoutService.updateWorkout(id, { title, category, tags: formattedTags, exercises });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update workout');
    }
  };

  if (loading) return <div className="text-primary text-center mt-20 font-heading text-2xl animate-pulse">Loading Routine...</div>;

  return (
    <div className="min-h-screen bg-darkBg p-6 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto bg-darkCard p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-800/50">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800/50">
          <h2 className="text-3xl font-heading font-black text-headings tracking-tight">EDIT ROUTINE</h2>
          <button onClick={() => navigate('/')} className="text-bodyText hover:text-headings text-sm font-semibold uppercase tracking-wider transition-colors">Cancel</button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-bodyText text-xs font-bold uppercase tracking-wider mb-2">Routine Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-darkBg border border-gray-700/50 rounded-lg p-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-lg" />
            </div>
            <div>
              <label className="block text-bodyText text-xs font-bold uppercase tracking-wider mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-darkBg border border-gray-700/50 rounded-lg p-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all">
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibility">Flexibility</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>
            <div>
              <label className="block text-bodyText text-xs font-bold uppercase tracking-wider mb-2">Tags (comma separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-darkBg border border-gray-700/50 rounded-lg p-3 text-headings focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-xl font-heading font-bold text-headings mb-6">EXERCISES</h3>
            <div className="space-y-4">
              <AnimatePresence>
                {exercises.map((exercise, index) => (
                  <motion.div key={index} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-darkBg p-5 rounded-xl border border-gray-700/50 relative group overflow-hidden">
                    {exercises.length > 1 && (
                      <button type="button" onClick={() => handleRemoveExercise(index)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors">Remove</button>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div className="col-span-2 md:col-span-4 flex gap-4">
                        <div className="w-1/3 md:w-1/4">
                          <label className="block text-bodyText text-[10px] font-bold uppercase tracking-wider mb-1.5">Type</label>
                          <select 
                            value={exercise.exerciseType || 'Strength'} 
                            onChange={(e) => handleExerciseChange(index, 'exerciseType', e.target.value)}
                            className="w-full bg-darkCard border border-gray-700/50 rounded-lg p-2.5 text-headings focus:border-primary focus:outline-none transition-all text-sm"
                          >
                            <option value="Strength">Strength</option>
                            <option value="Cardio">Cardio</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-bodyText text-[10px] font-bold uppercase tracking-wider mb-1.5">Exercise Name</label>
                          <input 
                            type="text" required value={exercise.name} onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                            className="w-full bg-darkCard border border-gray-700/50 rounded-lg p-2.5 text-headings focus:border-primary focus:outline-none transition-all text-sm"
                            placeholder={exercise.exerciseType === 'Cardio' ? "e.g., Treadmill" : "e.g., Barbell Squat"}
                          />
                        </div>
                      </div>

                      {exercise.exerciseType === 'Cardio' ? (
                        <>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-bodyText text-[10px] font-bold uppercase tracking-wider mb-1.5">Duration (mins)</label>
                            <input type="number" required min="1" value={exercise.duration || ''} onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)} className="w-full bg-darkCard border border-gray-700/50 rounded-lg p-2.5 text-headings focus:border-primary focus:outline-none transition-all" />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-bodyText text-[10px] font-bold uppercase tracking-wider mb-1.5">Distance</label>
                            <input type="number" step="0.1" value={exercise.distance || ''} onChange={(e) => handleExerciseChange(index, 'distance', e.target.value)} className="w-full bg-darkCard border border-gray-700/50 rounded-lg p-2.5 text-headings focus:border-primary focus:outline-none transition-all" placeholder="km / miles" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-bodyText text-[10px] font-bold uppercase tracking-wider mb-1.5">Sets</label>
                            <input type="number" required min="1" value={exercise.sets || ''} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} className="w-full bg-darkCard border border-gray-700/50 rounded-lg p-2.5 text-headings focus:border-primary focus:outline-none transition-all" />
                          </div>
                          <div>
                            <label className="block text-bodyText text-[10px] font-bold uppercase tracking-wider mb-1.5">Reps</label>
                            <input type="number" required min="1" value={exercise.reps || ''} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} className="w-full bg-darkCard border border-gray-700/50 rounded-lg p-2.5 text-headings focus:border-primary focus:outline-none transition-all" />
                          </div>
                          <div className="col-span-2 md:col-span-2">
                            <label className="block text-bodyText text-[10px] font-bold uppercase tracking-wider mb-1.5">Weight</label>
                            <input type="number" value={exercise.weight || ''} onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)} className="w-full bg-darkCard border border-gray-700/50 rounded-lg p-2.5 text-headings focus:border-primary focus:outline-none transition-all" placeholder="kg / lbs" />
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button type="button" onClick={handleAddExercise} className="mt-6 text-primary hover:text-accent font-bold text-sm uppercase tracking-wider transition-colors flex items-center gap-2"><span className="text-xl leading-none">+</span> Add Exercise</button>
          </div>

          <div className="pt-6 border-t border-gray-800/50">
            <button type="submit" className="w-full bg-primary hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] text-headings font-bold py-4 rounded-xl transition-all duration-300 text-lg tracking-wide">UPDATE ROUTINE</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditWorkout;