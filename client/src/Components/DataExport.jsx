
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Download, X, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import reportService from '../services/reportService';

// Format dates for display
const formatDate = (date) => {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString();
};

// Safely format numeric values
const number = (value) => Number(value || 0).toFixed(1);

// CSV cell escaping
const escapeCSV = (value) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

// Download CSV file
const downloadCSV = (rows, filename) => {
  const csvContent = rows
    .map(row => row.map(escapeCSV).join(','))
    .join('\n');

  const blob = new Blob(
    ['\uFEFF' + csvContent],
    { type: 'text/csv;charset=utf-8;' }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// Add a section to PDF
const addPDFSection = (doc, title, headers, rows) => {
  let startY = doc.lastAutoTable?.finalY
    ? doc.lastAutoTable.finalY + 12
    : 35;

  if (startY > 250) {
    doc.addPage();
    startY = 20;
  }

  doc.setFontSize(13);
  doc.setTextColor(230, 126, 34);
  doc.text(title, 14, startY);

  autoTable(doc, {
    startY: startY + 4,
    head: [headers],
    body: rows.length ? rows : [['No records found']],
    theme: 'grid',
    headStyles: {
      fillColor: [35, 35, 35],
      textColor: [255, 255, 255],
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3
    },
    styles: {
      overflow: 'linebreak'
    },
    margin: { left: 14, right: 14 }
  });
};

const DataExport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate PDF report
  const exportPDF = (data) => {
    const doc = new jsPDF();

    const periodLabel = period === 'all'
      ? 'All Time'
      : 'Last 7 Days';

    // Report heading
    doc.setFontSize(21);
    doc.setTextColor(230, 126, 34);
    doc.text('ARK FITNESS', 14, 18);

    doc.setFontSize(15);
    doc.setTextColor(30, 30, 30);
    doc.text('Performance Report', 14, 28);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Period: ${periodLabel}`, 14, 36);
    doc.text(`User: ${data.user?.username || 'User'}`, 14, 42);
    doc.text(`Email: ${data.user?.email || 'N/A'}`, 14, 48);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 54);

    if (data.dateRange) {
      doc.text(
        `Date Range: ${data.dateRange.startDate} to ${data.dateRange.endDate}`,
        14,
        60
      );
    }

    // Summary
    const summary = data.summary || {};

    addPDFSection(
      doc,
      'Performance Summary',
      ['Metric', 'Total'],
      [
        ['Body Metric Records', summary.totalBodyMetricRecords || 0],
        ['Nutrition Days', summary.totalNutritionDays || 0],
        ['Total Workouts', summary.totalWorkouts || 0],
        ['Total Exercises', summary.totalExercises || 0],
        ['Calories Consumed', number(summary.nutrition?.calories)],
        ['Protein (g)', number(summary.nutrition?.protein)],
        ['Carbs (g)', number(summary.nutrition?.carbs)],
        ['Fat (g)', number(summary.nutrition?.fat)]
      ]
    );

    // Body Metrics
    const bodyRows = (data.bodyMetrics || []).map(metric => [
      formatDate(metric.date),
      number(metric.weight),
      number(metric.measurements?.chest),
      number(metric.measurements?.waist),
      number(metric.measurements?.hips),
      number(metric.measurements?.arms),
      number(metric.measurements?.thighs),
      metric.notes || '-'
    ]);

    addPDFSection(
      doc,
      'Body Metrics',
      [
        'Date',
        'Weight',
        'Chest',
        'Waist',
        'Hips',
        'Arms',
        'Thighs',
        'Notes'
      ],
      bodyRows
    );

    // Nutrition daily summary
    const nutritionRows = (data.nutrition || []).map(log => [
      log.dateString || 'N/A',
      number(log.dailyTotals?.calories),
      number(log.dailyTotals?.protein),
      number(log.dailyTotals?.carbs),
      number(log.dailyTotals?.fat)
    ]);

    addPDFSection(
      doc,
      'Daily Nutrition Summary',
      ['Date', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)'],
      nutritionRows
    );

    // Individual food items
    const foodRows = [];

    (data.nutrition || []).forEach(log => {
      const meals = log.meals || {};

      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
        (meals[meal] || []).forEach(food => {
          foodRows.push([
            log.dateString || 'N/A',
            meal,
            food.name || '-',
            number(food.calories),
            number(food.protein),
            number(food.carbs),
            number(food.fat)
          ]);
        });
      });
    });

    addPDFSection(
      doc,
      'Nutrition Food Details',
      [
        'Date',
        'Meal',
        'Food Item',
        'Calories',
        'Protein',
        'Carbs',
        'Fat'
      ],
      foodRows
    );

    // Workout and exercise details
    const workoutRows = [];

    (data.workouts || []).forEach(workout => {
      (workout.exercises || []).forEach(exercise => {
        const details = exercise.exerciseType === 'Cardio'
          ? `Duration: ${exercise.duration ?? '-'} min, Distance: ${exercise.distance ?? '-'}`
          : `Sets: ${exercise.sets ?? '-'}, Reps: ${exercise.reps ?? '-'}, Weight: ${exercise.weight ?? 0}`;

        workoutRows.push([
          workout.dateString || 'N/A',
          workout.title || '-',
          workout.category || '-',
          exercise.name || '-',
          exercise.exerciseType || '-',
          details,
          exercise.notes || '-'
        ]);
      });
    });

    addPDFSection(
      doc,
      'Workout & Exercise Details',
      [
        'Date',
        'Workout',
        'Category',
        'Exercise',
        'Type',
        'Details',
        'Notes'
      ],
      workoutRows
    );

    // Footer page numbers
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);

      doc.text(
        `ARK Fitness | Page ${i} of ${pageCount}`,
        14,
        290
      );
    }

    doc.save(`ARK-Fitness-${periodLabel.replace(/\s/g, '-')}-Report.pdf`);
  };

  // Generate CSV report
  const exportCSV = (data) => {
    const rows = [];

    const addSection = (title, headers, records) => {
      rows.push([]);
      rows.push([title]);
      rows.push(headers);

      if (records.length) {
        records.forEach(record => rows.push(record));
      } else {
        rows.push(['No records found']);
      }
    };

    rows.push(['ARK FITNESS - PERFORMANCE REPORT']);
    rows.push(['User', data.user?.username || 'User']);
    rows.push(['Email', data.user?.email || 'N/A']);
    rows.push(['Period', period === 'all' ? 'All Time' : 'Last 7 Days']);
    rows.push(['Generated', new Date().toLocaleDateString()]);

    if (data.dateRange) {
      rows.push(['Start Date', data.dateRange.startDate]);
      rows.push(['End Date', data.dateRange.endDate]);
    }

    const summary = data.summary || {};

    addSection(
      'Performance Summary',
      ['Metric', 'Total'],
      [
        ['Body Metric Records', summary.totalBodyMetricRecords || 0],
        ['Nutrition Days', summary.totalNutritionDays || 0],
        ['Total Workouts', summary.totalWorkouts || 0],
        ['Total Exercises', summary.totalExercises || 0],
        ['Calories Consumed', number(summary.nutrition?.calories)],
        ['Protein (g)', number(summary.nutrition?.protein)],
        ['Carbs (g)', number(summary.nutrition?.carbs)],
        ['Fat (g)', number(summary.nutrition?.fat)]
      ]
    );

    // Body Metrics
    addSection(
      'Body Metrics',
      ['Date', 'Weight', 'Chest', 'Waist', 'Hips', 'Arms', 'Thighs', 'Notes'],
      (data.bodyMetrics || []).map(metric => [
        formatDate(metric.date),
        number(metric.weight),
        number(metric.measurements?.chest),
        number(metric.measurements?.waist),
        number(metric.measurements?.hips),
        number(metric.measurements?.arms),
        number(metric.measurements?.thighs),
        metric.notes || '-'
      ])
    );

    // Nutrition daily totals
    addSection(
      'Daily Nutrition Summary',
      ['Date', 'Calories', 'Protein', 'Carbs', 'Fat'],
      (data.nutrition || []).map(log => [
        log.dateString || 'N/A',
        number(log.dailyTotals?.calories),
        number(log.dailyTotals?.protein),
        number(log.dailyTotals?.carbs),
        number(log.dailyTotals?.fat)
      ])
    );

    // Individual food items
    const foodRows = [];

    (data.nutrition || []).forEach(log => {
      const meals = log.meals || {};

      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
        (meals[meal] || []).forEach(food => {
          foodRows.push([
            log.dateString || 'N/A',
            meal,
            food.name || '-',
            number(food.calories),
            number(food.protein),
            number(food.carbs),
            number(food.fat)
          ]);
        });
      });
    });

    addSection(
      'Nutrition Food Details',
      ['Date', 'Meal', 'Food Item', 'Calories', 'Protein', 'Carbs', 'Fat'],
      foodRows
    );

    // Workout details
    const workoutRows = [];

    (data.workouts || []).forEach(workout => {
      (workout.exercises || []).forEach(exercise => {
        workoutRows.push([
          workout.dateString || 'N/A',
          workout.title || '-',
          workout.category || '-',
          exercise.name || '-',
          exercise.exerciseType || '-',
          exercise.sets ?? '-',
          exercise.reps ?? '-',
          exercise.weight ?? 0,
          exercise.duration ?? '-',
          exercise.distance ?? '-',
          exercise.notes || '-'
        ]);
      });
    });

    addSection(
      'Workout & Exercise Details',
      [
        'Date',
        'Workout',
        'Category',
        'Exercise',
        'Type',
        'Sets',
        'Reps',
        'Weight',
        'Duration (min)',
        'Distance',
        'Notes'
      ],
      workoutRows
    );

    const filename = `ARK-Fitness-${period}-Report.csv`;
    downloadCSV(rows, filename);
  };

  // Fetch report and export selected format
  const handleExport = async (format) => {
    try {
      setLoading(true);
      setError('');

      const data = await reportService.getPerformanceReport(period);

      if (!data?.success) {
        throw new Error('Unable to generate performance report.');
      }

      if (format === 'pdf') {
        exportPDF(data);
      } else {
        exportCSV(data);
      }

      setIsOpen(false);
    } catch (err) {
      console.error('Report Export Error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Something went wrong while exporting.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dashboard Export Button */}
      <button
        onClick={() => {
          setError('');
          setIsOpen(true);
        }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-primary text-white font-semibold text-sm
          hover:opacity-90 transition-all"
      >
        <FileText size={17} />
        <span>Export Report</span>
      </button>

      {/* Export Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center
              justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => !loading && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border
                border-gray-700 bg-darkCard p-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-primary/15
                    flex items-center justify-center mb-3">
                    <FileText className="text-primary" size={23} />
                  </div>

                  <h2 className="text-xl font-bold text-headings">
                    Export Performance
                  </h2>

                  <p className="text-sm text-bodyText mt-1">
                    Download your fitness performance report.
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="text-gray-400 hover:text-white
                    transition-colors disabled:opacity-40"
                >
                  <X size={21} />
                </button>
              </div>

              {/* Period Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold
                  text-headings mb-3">
                  Select Report Period
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPeriod('all')}
                    disabled={loading}
                    className={`p-3 rounded-xl border text-sm font-semibold
                      transition-all ${
                        period === 'all'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-700 text-bodyText hover:border-gray-500'
                      }`}
                  >
                    All Time
                  </button>

                  <button
                    onClick={() => setPeriod('weekly')}
                    disabled={loading}
                    className={`p-3 rounded-xl border text-sm font-semibold
                      transition-all ${
                        period === 'weekly'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-700 text-bodyText hover:border-gray-500'
                      }`}
                  >
                    Last 7 Days
                  </button>
                </div>
              </div>

              {/* Export Format */}
              <div className="mb-5">
                <label className="block text-sm font-semibold
                  text-headings mb-3">
                  Choose Export Format
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2
                      rounded-xl bg-primary px-4 py-3 text-white
                      font-semibold hover:opacity-90 transition-all
                      disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <FileText size={17} />
                    )}
                    PDF
                  </button>

                  <button
                    onClick={() => handleExport('csv')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2
                      rounded-xl border border-gray-600 px-4 py-3
                      text-headings font-semibold hover:bg-gray-800
                      transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Download size={17} />
                    )}
                    CSV
                  </button>
                </div>
              </div>

              {/* Loading / Error */}
              {loading && (
                <p className="text-sm text-primary text-center mb-3">
                  Preparing your report...
                </p>
              )}

              {error && (
                <p className="text-sm text-red-400 text-center mb-3">
                  {error}
                </p>
              )}

              <p className="text-xs text-bodyText text-center">
                Your report includes body metrics, nutrition and workouts.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DataExport;
