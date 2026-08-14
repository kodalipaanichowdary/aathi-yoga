export const DIFFICULTIES = [
  { slug: 'beginner', label: 'Beginner' },
  { slug: 'intermediate', label: 'Intermediate' },
  { slug: 'advanced', label: 'Advanced' },
]

function pose(id, name, illustration, durationSec, steps, image) {
  return { id, name, illustration, durationSec, steps, image }
}

function step(title, action, position, breathing, safety, completionNote) {
  return { title, action, position, breathing, safety, completionNote }
}

const mountainPose = pose('mountain', 'Mountain Pose (Tadasana)', 'mountain', 60, [
  step(
    'Step 1',
    'Stand tall with feet hip-width apart',
    'Ground all four corners of your feet evenly into the mat, distributing weight equally.',
    'Take slow, even breaths through the nose.',
    'Keep knees soft, not locked.',
    'Feel your spine lengthen with each inhale.',
  ),
  step(
    'Step 2',
    'Engage core & roll shoulders back',
    'Lengthen your spine toward the ceiling with arms resting gracefully at sides.',
    'Inhale for 4 counts, exhale for 4 counts.',
    'Avoid overarching the lower back.',
    'Notice your posture settling into alignment.',
  ),
  step(
    'Step 3',
    'Hold this position & focus on breath',
    'Relax facial muscles, maintaining smooth diaphragmatic breaths.',
    'Continue slow diaphragmatic breathing.',
    'If dizzy, open eyes and focus on a fixed point.',
    'You are grounded and centered — ready for the next pose.',
  ),
], '/assets/yoga/poses/mountain-pose/pose.webp')

const childPose = pose("child", "Child's Pose (Balasana)", 'child', 60, [
  step(
    'Step 1',
    'Kneel with big toes touching',
    'Separate knees mat-width apart and sit hips back gently on your heels.',
    'Breathe naturally, letting the belly soften.',
    'Place a cushion between calves and thighs if hips feel tight.',
    'Feel your lower back gently release.',
  ),
  step(
    'Step 2',
    'Walk hands forward & lower forehead',
    'Extend arms straight out along the floor, resting forehead gently on mat.',
    'Exhale fully to deepen the stretch across the back.',
    'Keep arms relaxed, not straining forward.',
    'Shoulders should feel light and unweighted.',
  ),
  step(
    'Step 3',
    'Hold this position & release tension',
    'Let your spine and lower back decompress with slow deep exhalations.',
    'Slow, even breaths — extend the exhale slightly.',
    'Come up slowly to avoid head rush.',
    'A calm, restorative reset for the whole body.',
  ),
], '/assets/yoga/poses/child-pose/pose.webp')

const warriorPose = pose('warrior', 'Warrior II (Virabhadrasana)', 'warrior', 90, [
  step(
    'Step 1',
    'Stretch Out your arms',
    'Extend arms horizontally at 180° parallel to the floor, gazing over the front fingertips.',
    'Inhale to prepare, exhale as you expand your chest.',
    'Keep shoulders stacked over hips, avoiding leaning forward.',
    'Feel strength building through the arms and torso.',
  ),
  step(
    'Step 2',
    'Slowly position your legs as shown in the above figure',
    'Bend front knee at a 90° angle over ankle, pressing back foot firmly into the mat.',
    'Steady breath, in for 4 and out for 4.',
    'Keep the front knee tracking over the ankle, not past the toes.',
    'Notice the grounded stability of your wide stance.',
  ),
  step(
    'Step 3',
    'Hold this position & breathe deeply',
    'Sink gently into the hips while keeping the torso upright and spine long.',
    'Continue even breathing without holding the breath.',
    'Release immediately if there is knee pain.',
    'A strong, focused hold — well done.',
  ),
], '/assets/yoga/poses/warrior-pose/pose.webp')

const treePose = pose('tree', 'Tree Pose (Vrksasana)', 'tree', 60, [
  step(
    'Step 1',
    'Shift weight & ground standing leg',
    'Root firmly through the standing foot and find a soft focal point ahead.',
    'Steady, unhurried breathing to support balance.',
    'Avoid placing the foot directly on the knee joint.',
    'Find one soft focal point to steady your gaze.',
  ),
  step(
    'Step 2',
    'Place foot on inner thigh & join palms',
    'Open bent knee at 45° and bring palms together at chest in prayer (Anjali Mudra).',
    'Keep breath slow and even as balance is tested.',
    'Keep a slight bend in the standing knee if needed.',
    'Balance improves the longer you hold, stay patient.',
  ),
  step(
    'Step 3',
    'Hold this position & balance',
    'Lengthen the crown of the head while keeping a calm, steady rhythm of breath.',
    'One last deep breath before releasing.',
    'Step down with control rather than dropping the foot.',
    'Balance and focus — the mind and body in sync.',
  ),
], '/assets/yoga/poses/tree-pose/pose.webp')

const meditationPose = pose('meditation', 'Seated Meditation (Sukhasana)', 'meditation', 120, [
  step(
    'Step 1',
    'Find a comfortable crossed seat',
    'Sit tall with spine erect, pelvis level, and shoulders dropped away from ears.',
    'Breathe naturally, simply observing each inhale and exhale.',
    'Sit on a cushion if the hips feel lower than the knees.',
    'Let the shoulders drop away from the ears.',
  ),
  step(
    'Step 2',
    'Rest hands in Chin Mudra on knees',
    'Gently touch thumb and index finger together, softening the jaw and gaze.',
    'Begin counting each exhale, resetting after 10.',
    'If the mind wanders, gently return to the breath count.',
    'Notice the mind settling with each cycle.',
  ),
  step(
    'Step 3',
    'Hold this position & follow breath',
    'Close eyes softly and observe the natural, peaceful rhythm of each breath.',
    'No counting now — just present awareness of breathing.',
    'Open eyes slowly at the end, avoid standing up too fast.',
    'A quiet mind is the goal, not a blank one — well practiced.',
  ),
], '/assets/yoga/poses/seated-meditation/pose.webp')

function course(id, difficulty, name, duration, calories, shortDesc, poses, thumbnail) {
  return { id, difficulty, name, duration, calories, shortDesc, poses, thumbnail }
}

export const COURSES = [
  course('beg-01', 'beginner', 'Morning Flow Basics', 15, 60, 'A gentle wake-up sequence for total beginners.', [
    mountainPose,
    childPose,
    meditationPose,
  ], '/assets/yoga/courses/morning-flow-basics/thumbnail.webp'),
  course('beg-02', 'beginner', 'Foundations of Breath', 12, 45, 'Learn foundational breathing paired with grounding poses.', [
    mountainPose,
    meditationPose,
  ], '/assets/yoga/courses/foundations-of-breath/thumbnail.webp'),
  course('int-01', 'intermediate', 'Strength & Balance Flow', 25, 140, 'Build stability and strength through standing poses.', [
    warriorPose,
    treePose,
    childPose,
  ], '/assets/yoga/courses/strength-balance-flow/thumbnail.webp'),
  course('int-02', 'intermediate', 'Focused Balance Series', 20, 110, 'A balance-focused sequence to sharpen concentration.', [
    treePose,
    warriorPose,
    meditationPose,
  ], '/assets/yoga/courses/focused-balance-series/thumbnail.webp'),
  course('adv-01', 'advanced', 'Power Warrior Sequence', 35, 220, 'A demanding flow for experienced practitioners.', [
    warriorPose,
    treePose,
    warriorPose,
    meditationPose,
  ], '/assets/yoga/courses/power-warrior-sequence/thumbnail.webp'),
  course('adv-02', 'advanced', 'Deep Focus Practice', 30, 180, 'Advanced holds paired with extended meditation.', [
    treePose,
    warriorPose,
    meditationPose,
  ], '/assets/yoga/courses/deep-focus-practice/thumbnail.webp'),
]

export function getCoursesByDifficulty(slug) {
  return COURSES.filter((c) => c.difficulty === slug)
}

export function getCourseById(id) {
  return COURSES.find((c) => c.id === id) ?? null
}

export function getNextCourse(courseId) {
  const current = getCourseById(courseId)
  if (!current) return null
  const sameDifficulty = getCoursesByDifficulty(current.difficulty)
  const index = sameDifficulty.findIndex((c) => c.id === courseId)
  if (index === -1) return null
  return sameDifficulty[(index + 1) % sameDifficulty.length]
}
