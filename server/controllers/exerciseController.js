const Exercise = require('../models/Exercise');

const seedData = [
  // CHEST
  { 
    name: 'Barbell Bench Press', 
    category: 'Strength', 
    muscleGroup: 'Chest', 
    equipment: 'Barbell', 
    difficulty: 'Intermediate', 
    description: 'The Barbell Bench Press is the absolute gold standard for building upper body pushing mass, targeting the pectoralis major, anterior deltoids, and triceps. Lie flat on the bench with your eyes directly under the bar. Plant your feet firmly on the floor to establish a stable drive. Grip the bar slightly wider than shoulder-width with your wrists stacked directly over your elbows. Arch your upper back slightly to engage your lats, pull your shoulder blades down and together, and unrack the weight. Lower the bar smoothly with absolute control until it gently touches your mid-chest line, keeping your elbows tucked roughly at a 45-degree angle relative to your torso to protect your rotator cuffs. Pause for a split second, then drive the bar explosively back up toward the ceiling, locking your arms out at the top while maintaining your upper back tightness.', 
    image: '/images/exercises/bench-press.jpg' 
  },
  { 
    name: 'Incline Dumbbell Press', 
    category: 'Strength', 
    muscleGroup: 'Chest', 
    equipment: 'Dumbbell', 
    difficulty: 'Intermediate', 
    description: 'The Incline Dumbbell Press focuses heavily on the clavicular head of the pectoralis major (the upper chest), helping build a full, rounded upper shelf. Set an adjustable bench to a stable 30 to 45-degree angle. Sit back with a dumbbell in each hand resting on your thighs, then kick them up to your shoulders one by one. Press the dumbbells straight up over your upper chest, bringing them close together at the top without banging them. Lower the weights slowly in a controlled arc, allowing your elbows to drop below bench level to achieve a deep, fiber-tearing stretch across the chest fibers. Maintain a neutral wrist alignment and a locked-in core throughout the entire movement range.', 
    image: '/images/exercises/incline-dumbbell-press.jpg' 
  },
  { 
    name: 'Cable Crossovers', 
    category: 'Strength', 
    muscleGroup: 'Chest', 
    equipment: 'Machine', 
    difficulty: 'Beginner', 
    description: 'Cable Crossovers provide continuous tension throughout the entire movement arc, making them elite for chest isolation and deep inner-pec contractions. Stand dead-center in a dual-cable station with the pulleys adjusted to high positions. Grab the handles, step forward with a staggered stance for stability, and keep a permanent, soft bend in your elbows. Lean your torso forward slightly from the hips while keeping your spine straight and core braced. In a hugging motion, sweep your hands downward and inward until they cross slightly in front of your lower chest. Squeeze your pecs hard at peak contraction for two seconds, then slowly resist the cable pull on the return path back to starting position.', 
    image: '/images/exercises/cable-crossovers.jpg' 
  },
  
  // ARMS
  { 
    name: 'Barbell Bicep Curl', 
    category: 'Strength', 
    muscleGroup: 'Arms', 
    equipment: 'Barbell', 
    difficulty: 'Beginner', 
    description: 'The Barbell Bicep Curl is a classic compound movement designed to overload the biceps brachii and brachialis for maximum arm thickness. Stand completely upright with a tight core, glutes squeezed, and shoulders rolled back. Hold the barbell with an underhand shoulder-width grip. Pin your upper arms rigidly against your ribcage like they are locked in vices. Curl the weight upward in a smooth, sweeping arc by flexing strictly at the elbows. Avoid the temptation to heave your hips or swing your lower back. At the absolute top, flex your biceps aggressively, then lower the bar slowly back down to full arm extension, fighting gravity on every inch of the negative.', 
    image: '/images/exercises/barbell-bicep-curl.jpg' 
  },
  { 
    name: 'Tricep Rope Pushdown', 
    category: 'Strength', 
    muscleGroup: 'Arms', 
    equipment: 'Machine', 
    difficulty: 'Beginner', 
    description: 'The Tricep Rope Pushdown isolates the lateral and long heads of the triceps, delivering a sharp horseshoe definition. Attach a thick rope to a high-pulley cable station. Stand close to the stack, hinge slightly forward at the hips, and pin your upper arms tightly to your sides. Press the rope downward, and as your arms approach full extension, actively pull the two ends of the rope apart to maximize tricep contraction. Hold this lockout position for a split second before returning the handles upward under control, stopping right before your forearms pass parallel to the floor to maintain constant tension.', 
    image: '/images/exercises/tricep-rope-pushdown.jpg' 
  },
  { 
    name: 'Dumbbell Hammer Curls', 
    category: 'Strength', 
    muscleGroup: 'Arms', 
    equipment: 'Dumbbell', 
    difficulty: 'Beginner', 
    description: 'Hammer Curls target the brachialis (the muscle sitting underneath the bicep that pushes it up) and the brachioradialis in the forearm. Stand tall holding a pair of dumbbells at your sides with a neutral grip—palms facing inward toward your thighs. Keeping your elbows pinned securely to your sides, curl the dumbbells upward while maintaining that strict neutral palms-in orientation throughout the entire range. Squeeze hard at shoulder height, then lower them back down deliberately. This variation is stellar for building overall arm mass and robust grip strength.', 
    image: '/images/exercises/dumbbell-hammer-curls.jpg' 
  },
  { 
    name: 'Overhead Tricep Extension', 
    category: 'Strength', 
    muscleGroup: 'Arms', 
    equipment: 'Dumbbell', 
    difficulty: 'Intermediate', 
    description: 'Overhead extensions place the long head of the triceps into a fully stretched overhead position, triggering intense hypertrophy. Grab a single heavy dumbbell with both hands cupping the inner plate overhead. Keep your upper arms pinned close to your ears and pointed straight up toward the ceiling—do not let your elbows flare outward. Lower the dumbbell behind your head in a slow, controlled arc until your forearms touch your biceps, feeling an extreme stretch down the back of your arms. Press the weight back up to full overhead lockout by forcefully extending your elbows.', 
    image: '/images/exercises/overhead-tricep-extension.jpg' 
  },

  // BACK
  { 
    name: 'Conventional Deadlift', 
    category: 'Strength', 
    muscleGroup: 'Back', 
    equipment: 'Barbell', 
    difficulty: 'Advanced', 
    description: 'The Conventional Deadlift is the ultimate test of total-body strength, recruiting your entire posterior chain from calves to traps. Stand with your mid-foot positioned directly under a loaded barbell. Hinge at your hips, bend your knees, and grab the bar with a double-overhand or mixed grip just outside your legs. Drop your hips, chest up, pull the slack out of the bar, and flatten your spine entirely. Drive your feet down into the ground as if pushing the earth away, keeping the bar sliding tightly against your shins and thighs until you lock your hips out completely at the top.', 
    image: '/images/exercises/conventional-deadlift.jpg' 
  },
  { 
    name: 'Lat Pulldown', 
    category: 'Strength', 
    muscleGroup: 'Back', 
    equipment: 'Machine', 
    difficulty: 'Beginner', 
    description: 'The Lat Pulldown builds the coveted V-taper by targeting the latissimus dorsi muscles safely and effectively. Sit down at the pulldown station and adjust the knee pad snugly to lock your lower body in place. Grab the wide bar with an overhand grip wider than shoulder-width. Lean your torso backward slightly (about 15 degrees), puff your chest proudly toward the ceiling, and initiate the pull by driving your elbows straight down into your back pockets. Pull the bar down until it touches your upper chest, hold the squeeze for a moment, and let the weight pull your arms back up smoothly.', 
    image: '/images/exercises/lat-pulldown.jpg' 
  },
  { 
    name: 'Seated Cable Row', 
    category: 'Strength', 
    muscleGroup: 'Back', 
    equipment: 'Machine', 
    difficulty: 'Beginner', 
    description: 'The Seated Cable Row is a powerhouse movement for mid-back thickness, rhomboids, and rear deltoids. Sit on the bench with your feet planted firmly against the footplates, keeping a slight bend in your knees. Grab the V-bar handle, sit up tall with a completely straight spine, and lean forward slightly from the hips to stretch your lats. Pull the handle directly into your lower abdomen while driving your elbows backward past your torso. Pinch your shoulder blades together aggressively at peak contraction before letting the weight stretch you back forward under full control.', 
    image: '/images/exercises/seated-cable-row.jpg' 
  },

  // SHOULDERS
  { 
    name: 'Overhead Press (OHP)', 
    category: 'Strength', 
    muscleGroup: 'Shoulders', 
    equipment: 'Barbell', 
    difficulty: 'Intermediate', 
    description: 'The Overhead Press builds raw shoulder size, core stability, and upper body power from the ground up. Unrack a barbell so it rests across your front deltoids with your hands just outside shoulder-width. Squeeze your glutes, lock your legs, and brace your core like you are about to take a punch. Press the bar straight up toward the sky. As the bar clears your forehead, shift your torso slightly forward back underneath the bar to lock it out directly over your spine. Lower back down with absolute control.', 
    image: '/images/exercises/overhead-press.jpg' 
  },
  { 
    name: 'Dumbbell Lateral Raise', 
    category: 'Strength', 
    muscleGroup: 'Shoulders', 
    equipment: 'Dumbbell', 
    difficulty: 'Beginner', 
    description: 'Lateral Raises are irreplaceable for isolating the medial deltoids, which create the wide shoulder cap illusion. Stand tall holding light-to-moderate dumbbells at your sides. Maintain a micro-bend in your elbows and a slight forward lean from the hips. Raise both arms out laterally away from your body until they form a flat T-shape parallel to the floor. Imagine pouring water out of two pitchers at the top to keep your pinkies slightly higher than your thumbs. Lower the weights slowly without letting them touch your thighs between reps.', 
    image: '/images/exercises/dumbbell-lateral-raise.jpg' 
  },
  { 
    name: 'Face Pulls', 
    category: 'Strength', 
    muscleGroup: 'Shoulders', 
    equipment: 'Machine', 
    difficulty: 'Beginner', 
    description: 'Face Pulls are essential for bulletproofing your rotator cuffs, correcting poor posture, and blasting the rear delts and upper traps. Set a cable pulley at upper-head height with a dual rope attachment. Grab the rope with palms facing inward, step back to create tension, and pull the handles directly toward your face or eyes. As you pull, flare your elbows high and pull your hands apart behind your ears to create a double-bicep pose effect. Squeeze your upper back hard at the rear before extending your arms back out.', 
    image: '/images/exercises/face-pulls.jpg' 
  },

  // LEGS
  { 
    name: 'Barbell Back Squat', 
    category: 'Strength', 
    muscleGroup: 'Legs', 
    equipment: 'Barbell', 
    difficulty: 'Intermediate', 
    description: 'The Back Squat is the king of lower body movements, packing massive muscle onto the quadriceps, glutes, hamstrings, and core. Step under a barbell and rest it securely across your upper traps. Unrack the bar, take two steps back, and set your feet slightly wider than shoulder-width with toes pointed slightly outward. Take a massive belly breath, brace your core, break at your hips and knees simultaneously, and sink down into the hole until your hip crease drops below the top of your knee caps. Drive powerfully upward through your mid-foot, exploding out of the bottom while keeping your chest proud.', 
    image: '/images/exercises/barbell-back-squat.jpg' 
  },
  { 
    name: 'Bulgarian Split Squat', 
    category: 'Strength', 
    muscleGroup: 'Legs', 
    equipment: 'Dumbbell', 
    difficulty: 'Intermediate', 
    description: 'The Bulgarian Split Squat is a brutal unilateral movement that isolates each leg individually, ironing out strength imbalances and torching the glutes and quads. Stand roughly two feet in front of a flat bench facing away from it, and place the top of your trailing foot flat on the bench. Hold heavy dumbbells at your sides. Keeping your torso upright and your front shin relatively vertical, lower your hips straight down toward the floor until your back knee hovers an inch above the ground. Drive through the heel of your front foot to ascend.', 
    image: '/images/exercises/bulgarian-split-squat.jpg' 
  },
  { 
    name: 'Romanian Deadlift (RDL)', 
    category: 'Strength', 
    muscleGroup: 'Legs', 
    equipment: 'Barbell', 
    difficulty: 'Intermediate', 
    description: 'The Romanian Deadlift focuses intensely on eccentric loading of the hamstrings and glutes. Pick up a barbell with an overhand grip. Stand tall with soft knees—maintain this exact knee angle throughout the entire exercise without rebending or squatting down lower. Hinge backward at your hip joint, pushing your glutes straight back toward the wall behind you while keeping the barbell gliding smoothly against your thighs and shins. Lower until you feel an intense, maximum stretch in your hamstrings, then squeeze your glutes forward to lock out.', 
    image: '/images/exercises/romanian-deadlift.jpg' 
  },
  { 
    name: 'Leg Extension', 
    category: 'Strength', 
    muscleGroup: 'Legs', 
    equipment: 'Machine', 
    difficulty: 'Beginner', 
    description: 'The Leg Extension machine isolates the quadriceps directly without taxing your lower back or central nervous system. Adjust the back pad so your knees align perfectly with the machine pivot point, and rest the lower roller pad against your shins right above your feet. Grip the side handles for stability. Extend your legs upward until they are completely straight and parallel to the floor, holding a peak contraction for a full second to feel your teardrop quads contract violently. Lower the weight under absolute control without letting the weight plates slam down.', 
    image: '/images/exercises/leg-extension.jpg' 
  },

  // CORE
  { 
    name: 'Cable Crunches', 
    category: 'Strength', 
    muscleGroup: 'Core', 
    equipment: 'Machine', 
    difficulty: 'Intermediate', 
    description: 'Cable Crunches provide progressive overload to the rectus abdominis, helping build thick, defined abs. Attach a rope to a high cable stack and kneel down a couple of feet away from the machine. Hold the rope ends securely locked against the sides of your head or neck. Keep your hips stationary and locked in place—do not sit backward onto your heels. Flex your spine downward, curling your ribcage inward toward your pelvis while exhaling completely. Squeeze your abs hard at the bottom before slowly rising back up.', 
    image: '/images/exercises/cable-crunches.jpg' 
  },

  // CARDIO
  { 
    name: 'Treadmill Sprints', 
    category: 'Cardio', 
    muscleGroup: 'Full Body', 
    equipment: 'Machine', 
    difficulty: 'Advanced', 
    description: 'Treadmill Sprints are an elite conditioning tool for rapid fat loss, explosive anaerobic power, and cardiovascular stamina. Set the treadmill to a safe speed or manually jump your feet onto the side rails while accelerating the belt to a high sprint pace. Step back onto the moving belt and sprint at near-maximum effort for 20 to 30 seconds. Afterward, grab the safety handles, jump back to the side rails, and rest or jog lightly for 60 to 90 seconds to let your heart rate drop. Repeat this interval cycle for an intensely punishing conditioning session.', 
    image: '/images/exercises/treadmill-sprints.jpg' 
  },
  { 
    name: 'Stair Climber', 
    category: 'Cardio', 
    muscleGroup: 'Legs', 
    equipment: 'Machine', 
    difficulty: 'Beginner', 
    description: 'The Stair Climber is a relentless endurance engine that builds bulletproof legs, calf endurance, and supreme cardiovascular fitness. Step onto the revolving stairs at a comfortable, steady level. Maintain an upright, proud posture throughout your session—avoid leaning your entire upper body weight heavily onto the console handrails, as this cheats the core and leg engagement. Take full, rhythmic steps, placing your whole foot flat on each step. Push through your heels to climb continuously for your target duration.', 
    image: '/images/exercises/stair-climber.jpg' 
  }
];

exports.getExercises = async (req, res) => {
  try {
    const count = await Exercise.countDocuments();
    
    if (count === 0) {
      console.log('Auto-seeding Exercise Library with high-detail descriptions...');
      await Exercise.insertMany(seedData);
    }

    const { search, muscleGroup } = req.query;
    let query = {};

    if (muscleGroup && muscleGroup !== 'All') {
      query.muscleGroup = muscleGroup;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });
    res.status(200).json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};