
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import metricsService from '../services/metricsService';

const Metrics = () => {
  const initialForm = {
    date: new Date().toISOString().split('T')[0],
    weight: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    },
    notes: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [metrics, setMetrics] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass =
    'w-full bg-darkBg border border-gray-800 rounded-xl px-4 py-3 text-headings placeholder-gray-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10';

  const labelClass =
    'block text-sm font-bold text-gray-300 mb-2';

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await metricsService.getMetrics();
      setMetrics(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.measurements) {
      setFormData(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');

      const metricData = {
        ...formData,
        weight: Number(formData.weight),
        measurements: Object.fromEntries(
          Object.entries(formData.measurements).map(
            ([key, value]) => [
              key,
              value === '' ? 0 : Number(value)
            ]
          )
        )
      };

      if (editingId) {
        await metricsService.updateMetric(editingId, metricData);
      } else {
        await metricsService.addMetric(metricData);
      }

      setFormData({
        ...initialForm,
        date: new Date().toISOString().split('T')[0]
      });

      setEditingId(null);
      await fetchMetrics();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save metric');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (metric) => {
    setEditingId(metric._id);

    setFormData({
      date: new Date(metric.date).toISOString().split('T')[0],
      weight: metric.weight,
      measurements: {
        chest: metric.measurements?.chest ?? 0,
        waist: metric.measurements?.waist ?? 0,
        hips: metric.measurements?.hips ?? 0,
        arms: metric.measurements?.arms ?? 0,
        thighs: metric.measurements?.thighs ?? 0
      },
      notes: metric.notes || ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      await metricsService.deleteMetric(id);
      await fetchMetrics();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete metric');
    }
  };

  const handleCancel = () => {
    setFormData({
      ...initialForm,
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setError('');
  };

  const latestMetric = metrics[0];

  const averageWeight = metrics.length
    ? (
        metrics.reduce((total, item) => total + item.weight, 0) /
        metrics.length
      ).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-darkBg text-headings font-sans overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-xs font-black tracking-[0.3em] uppercase">
              Performance Tracking
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight">
            BODY <span className="text-primary">METRICS.</span>
          </h1>

          <p className="text-bodyText mt-4 max-w-xl leading-relaxed">
            Track your physical transformation. Record your measurements,
            monitor your weight, and stay focused on your progress.
          </p>
        </motion.div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

          <div className="bg-darkCard border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
              Current Weight
            </p>
            <h2 className="text-3xl font-black mt-3">
              {latestMetric ? latestMetric.weight : '--'}
              <span className="text-sm text-primary ml-2">kg</span>
            </h2>
            <p className="text-gray-500 text-xs mt-2">
              Latest recorded weight
            </p>
          </div>

          <div className="bg-darkCard border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
              Average Weight
            </p>
            <h2 className="text-3xl font-black mt-3">
              {metrics.length ? averageWeight : '--'}
              <span className="text-sm text-primary ml-2">kg</span>
            </h2>
            <p className="text-gray-500 text-xs mt-2">
              Across all recorded entries
            </p>
          </div>

          <div className="bg-darkCard border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
              Total Records
            </p>
            <h2 className="text-3xl font-black mt-3">
              {metrics.length}
            </h2>
            <p className="text-gray-500 text-xs mt-2">
              Saved measurement entries
            </p>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* FORM */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-darkCard border border-gray-800 rounded-3xl p-6 md:p-8 mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <p className="text-primary text-xs font-black tracking-[0.2em] uppercase mb-2">
                {editingId ? 'Edit Entry' : 'New Entry'}
              </p>

              <h2 className="text-2xl font-heading font-black">
                {editingId ? 'UPDATE YOUR METRICS.' : 'LOG YOUR PROGRESS.'}
              </h2>
            </div>

            <div className="text-gray-500 text-xs font-bold tracking-wider">
              WEIGHT & BODY MEASUREMENTS
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              <div>
                <label className={labelClass}>Measurement Date</label>
                <input
                  type="date"
                  name="date"
                  className={inputClass}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  className={inputClass}
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  required
                />
              </div>

              {Object.keys(formData.measurements).map(field => (
                <div key={field}>
                  <label className={labelClass}>
                    {field.charAt(0).toUpperCase() + field.slice(1)} (cm)
                  </label>

                  <input
                    type="number"
                    name={field}
                    className={inputClass}
                    placeholder={`Enter ${field}`}
                    value={formData.measurements[field]}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </div>
              ))}

              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Additional Notes</label>

                <textarea
                  name="notes"
                  rows="3"
                  className={inputClass}
                  placeholder="Write something about your progress..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="flex flex-wrap gap-4 mt-8">

              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-orange-500 disabled:opacity-60 text-white font-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-600/10"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Measurement'
                    : 'Save Measurement'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-gray-700 hover:border-gray-500 text-gray-300 font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>
        </motion.section>

        {/* HISTORY */}
        <section className="bg-darkCard border border-gray-800 rounded-3xl overflow-hidden">

          <div className="p-6 md:p-8 border-b border-gray-800">
            <p className="text-primary text-xs font-black tracking-[0.2em] uppercase mb-2">
              Your Records
            </p>

            <h2 className="text-2xl font-heading font-black">
              MEASUREMENT HISTORY.
            </h2>

            <p className="text-bodyText text-sm mt-2">
              Review and manage your previous measurements.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-400">
              Loading measurements...
            </div>
          ) : metrics.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="text-4xl mb-4 text-primary">＋</div>
              <h3 className="text-xl font-bold mb-2">
                NO RECORDS YET.
              </h3>
              <p className="text-bodyText text-sm">
                Add your first measurement to start tracking your progress.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">

                <thead className="bg-darkBg text-gray-400 text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Weight</th>
                    <th className="px-6 py-5">Chest</th>
                    <th className="px-6 py-5">Waist</th>
                    <th className="px-6 py-5">Hips</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">

                  {metrics.map(metric => (
                    <tr
                      key={metric._id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-5 text-gray-400 text-sm whitespace-nowrap">
                        {new Date(metric.date).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5 text-headings font-bold">
                        {metric.weight} <span className="text-primary text-xs">kg</span>
                      </td>

                      <td className="px-6 py-5 text-gray-300 text-sm">
                        {metric.measurements?.chest ?? 0} cm
                      </td>

                      <td className="px-6 py-5 text-gray-300 text-sm">
                        {metric.measurements?.waist ?? 0} cm
                      </td>

                      <td className="px-6 py-5 text-gray-300 text-sm">
                        {metric.measurements?.hips ?? 0} cm
                      </td>

                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(metric)}
                          className="text-primary hover:text-orange-400 text-xs font-black uppercase tracking-wider mr-4"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(metric._id)}
                          className="text-red-400 hover:text-red-300 text-xs font-black uppercase tracking-wider"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}

        </section>

        {/* FOOTER NOTE */}
        <p className="text-center text-gray-600 text-xs mt-8 tracking-wider">
          CONSISTENCY BUILDS PROGRESS. KEEP SHOWING UP.
        </p>

      </div>
    </div>
  );
};

export default Metrics;
