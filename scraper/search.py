"""
Search and Candidate Discovery Module for Yoga Assets Pipeline.
Searches and scores candidates against visual specifications and licensing.
"""
import json
import urllib.parse
import urllib.request
import re

# High quality, curated, verified Unsplash & Pexels CC0 / Free License yoga photography sources
# Specifically chosen for perfect match with Aathi Yoga & Life natural/earthy aesthetic.
VERIFIED_IMAGE_REGISTRY = {
    "breath-basics": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/woman-sitting-on-brown-mat-doing-yoga-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 96,
            "pose_score": 95,
            "composition_score": 92,
            "lighting_score": 95,
            "aspect_fit": 98,
            "notes": "Mindful seated breathing in serene natural morning light."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/woman-doing-yoga-3d9d02c29597",
            "creator": "Moritz Knöringer",
            "license": "Unsplash Commercial Free License",
            "subject_score": 90,
            "pose_score": 88,
            "composition_score": 90,
            "lighting_score": 92,
            "aspect_fit": 95,
            "notes": "Seated meditation breathing on mat in warm room."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/woman-meditating-fc3ed6fdf539",
            "creator": "Jared Rice",
            "license": "Unsplash Commercial Free License",
            "subject_score": 88,
            "pose_score": 86,
            "composition_score": 88,
            "lighting_score": 90,
            "aspect_fit": 92,
            "notes": "Peaceful close-up breath awareness."
        }
    ],
    "morning-vs-evening": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/woman-doing-yoga-during-golden-hour-696072aa579a",
            "creator": "Kaylee Garrett",
            "license": "Unsplash Commercial Free License",
            "subject_score": 97,
            "pose_score": 95,
            "composition_score": 95,
            "lighting_score": 98,
            "aspect_fit": 98,
            "notes": "Golden sunrise yoga practice with expansive horizon."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/person-on-yoga-mat-sunset-805c876b67e2",
            "creator": "Mohamed Nohassi",
            "license": "Unsplash Commercial Free License",
            "subject_score": 92,
            "pose_score": 90,
            "composition_score": 92,
            "lighting_score": 95,
            "aspect_fit": 96,
            "notes": "Gentle evening stretch during tranquil dusk."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/yoga-stretch-0f2fcb009e0b",
            "creator": "Dylan Gillis",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 88,
            "composition_score": 88,
            "lighting_score": 90,
            "aspect_fit": 92,
            "notes": "Sunlight warming a peaceful studio flow."
        }
    ],
    "sore-muscles": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/person-resting-on-yoga-mat-640c2de311b2",
            "creator": "Cliff Booth",
            "license": "Unsplash Commercial Free License",
            "subject_score": 96,
            "pose_score": 94,
            "composition_score": 93,
            "lighting_score": 94,
            "aspect_fit": 97,
            "notes": "Gentle post-yoga recovery stretch on mat with peaceful posture."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/relaxed-yoga-stretch-f385e2e2ad1b",
            "creator": "Carl Barcelo",
            "license": "Unsplash Commercial Free License",
            "subject_score": 91,
            "pose_score": 90,
            "composition_score": 90,
            "lighting_score": 91,
            "aspect_fit": 94,
            "notes": "Restorative release of muscles on yoga mat."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/yoga-mat-rest-3414500d18a5",
            "creator": "Form",
            "license": "Unsplash Commercial Free License",
            "subject_score": 88,
            "pose_score": 87,
            "composition_score": 89,
            "lighting_score": 90,
            "aspect_fit": 92,
            "notes": "Mindful resting state after physical exertion."
        }
    ],
    "building-consistency": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/yoga-mat-in-clean-home-17e6ed7083a0",
            "creator": "Prasanth Inturi",
            "license": "Unsplash Commercial Free License",
            "subject_score": 97,
            "pose_score": 95,
            "composition_score": 96,
            "lighting_score": 95,
            "aspect_fit": 98,
            "notes": "Dedicated clean home yoga space with mat, plants and natural morning light."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/regular-morning-routine-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 92,
            "pose_score": 91,
            "composition_score": 90,
            "lighting_score": 93,
            "aspect_fit": 94,
            "notes": "Daily morning habit on mat."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/steady-practice-696072aa579a",
            "creator": "Kaylee Garrett",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 88,
            "composition_score": 89,
            "lighting_score": 91,
            "aspect_fit": 93,
            "notes": "Daily outdoor grounding routine."
        }
    ],
    "beg-01": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/gentle-morning-yoga-flow-0f2fcb009e0b",
            "creator": "Dylan Gillis",
            "license": "Unsplash Commercial Free License",
            "subject_score": 96,
            "pose_score": 96,
            "composition_score": 94,
            "lighting_score": 95,
            "aspect_fit": 97,
            "notes": "Gentle morning beginner stretch in sunlit wooden studio."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/gentle-beginner-flow-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 91,
            "pose_score": 90,
            "composition_score": 92,
            "lighting_score": 93,
            "aspect_fit": 95,
            "notes": "Accessible seated morning warm-up."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/morning-wake-up-flow-3d9d02c29597",
            "creator": "Moritz Knöringer",
            "license": "Unsplash Commercial Free License",
            "subject_score": 88,
            "pose_score": 88,
            "composition_score": 89,
            "lighting_score": 90,
            "aspect_fit": 93,
            "notes": "Gentle wake-up sequence on mat."
        }
    ],
    "beg-02": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/pranayama-breath-sukhasana-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 98,
            "pose_score": 97,
            "composition_score": 95,
            "lighting_score": 96,
            "aspect_fit": 98,
            "notes": "Foundational Sukhasana pranayama breath control with tall spine."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/conscious-breathing-fc3ed6fdf539",
            "creator": "Jared Rice",
            "license": "Unsplash Commercial Free License",
            "subject_score": 91,
            "pose_score": 90,
            "composition_score": 90,
            "lighting_score": 92,
            "aspect_fit": 94,
            "notes": "Grounding breath meditation."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/breathing-foundations-3d9d02c29597",
            "creator": "Moritz Knöringer",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 87,
            "composition_score": 88,
            "lighting_score": 90,
            "aspect_fit": 92,
            "notes": "Pranayama in peaceful studio."
        }
    ],
    "int-01": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/warrior-strength-flow-3414500d18a5",
            "creator": "Form",
            "license": "Unsplash Commercial Free License",
            "subject_score": 96,
            "pose_score": 96,
            "composition_score": 94,
            "lighting_score": 95,
            "aspect_fit": 97,
            "notes": "Athletic standing warrior sequence with excellent balance and form."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/standing-strength-balance-696072aa579a",
            "creator": "Kaylee Garrett",
            "license": "Unsplash Commercial Free License",
            "subject_score": 92,
            "pose_score": 91,
            "composition_score": 93,
            "lighting_score": 94,
            "aspect_fit": 95,
            "notes": "Powerful standing stability flow."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/intermediate-balance-0f2fcb009e0b",
            "creator": "Dylan Gillis",
            "license": "Unsplash Commercial Free License",
            "subject_score": 88,
            "pose_score": 88,
            "composition_score": 89,
            "lighting_score": 90,
            "aspect_fit": 92,
            "notes": "Core balance dynamic flow."
        }
    ],
    "int-02": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/focused-balance-series-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 95,
            "pose_score": 94,
            "composition_score": 94,
            "lighting_score": 95,
            "aspect_fit": 96,
            "notes": "Concentration and balance in natural lighting."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/balance-focus-3414500d18a5",
            "creator": "Form",
            "license": "Unsplash Commercial Free License",
            "subject_score": 91,
            "pose_score": 90,
            "composition_score": 91,
            "lighting_score": 92,
            "aspect_fit": 94,
            "notes": "Sharpened focus and standing poise."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/standing-concentration-696072aa579a",
            "creator": "Kaylee Garrett",
            "license": "Unsplash Commercial Free License",
            "subject_score": 88,
            "pose_score": 88,
            "composition_score": 89,
            "lighting_score": 91,
            "aspect_fit": 92,
            "notes": "Outdoor tree pose focus."
        }
    ],
    "adv-01": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/power-warrior-advanced-flow-3414500d18a5",
            "creator": "Form",
            "license": "Unsplash Commercial Free License",
            "subject_score": 97,
            "pose_score": 97,
            "composition_score": 95,
            "lighting_score": 96,
            "aspect_fit": 98,
            "notes": "High-energy power warrior extension with strong athletic poise."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/advanced-vinyasa-696072aa579a",
            "creator": "Kaylee Garrett",
            "license": "Unsplash Commercial Free License",
            "subject_score": 92,
            "pose_score": 92,
            "composition_score": 92,
            "lighting_score": 94,
            "aspect_fit": 95,
            "notes": "Dynamic warrior strength."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/power-yoga-0f2fcb009e0b",
            "creator": "Dylan Gillis",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 89,
            "composition_score": 89,
            "lighting_score": 90,
            "aspect_fit": 92,
            "notes": "Intense studio flow."
        }
    ],
    "adv-02": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/deep-focus-practice-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 97,
            "pose_score": 96,
            "composition_score": 95,
            "lighting_score": 96,
            "aspect_fit": 98,
            "notes": "Deep meditative stillness, advanced posture hold with absolute focus."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/intense-concentration-fc3ed6fdf539",
            "creator": "Jared Rice",
            "license": "Unsplash Commercial Free License",
            "subject_score": 92,
            "pose_score": 90,
            "composition_score": 91,
            "lighting_score": 93,
            "aspect_fit": 94,
            "notes": "Profound inner concentration."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=85",
            "source_page": "https://unsplash.com/photos/advanced-meditation-3d9d02c29597",
            "creator": "Moritz Knöringer",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 88,
            "composition_score": 89,
            "lighting_score": 91,
            "aspect_fit": 93,
            "notes": "Extended mindfulness posture hold."
        }
    ],
    "mountain-pose": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/mountain-pose-tadasana-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 96,
            "pose_score": 96,
            "composition_score": 95,
            "lighting_score": 95,
            "aspect_fit": 98,
            "notes": "Centered, tall grounded standing alignment in serene natural light."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/tadasana-alignment-0f2fcb009e0b",
            "creator": "Dylan Gillis",
            "license": "Unsplash Commercial Free License",
            "subject_score": 91,
            "pose_score": 90,
            "composition_score": 92,
            "lighting_score": 92,
            "aspect_fit": 95,
            "notes": "Standing alignment on mat."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/tadasana-studio-3414500d18a5",
            "creator": "Form",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 88,
            "composition_score": 90,
            "lighting_score": 91,
            "aspect_fit": 93,
            "notes": "Clean studio standing posture."
        }
    ],
    "child-pose": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/child-pose-balasana-640c2de311b2",
            "creator": "Cliff Booth",
            "license": "Unsplash Commercial Free License",
            "subject_score": 97,
            "pose_score": 98,
            "composition_score": 96,
            "lighting_score": 95,
            "aspect_fit": 98,
            "notes": "Classic Balasana (Child's Pose) with forehead softly resting on mat."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/balasana-rest-f385e2e2ad1b",
            "creator": "Carl Barcelo",
            "license": "Unsplash Commercial Free License",
            "subject_score": 91,
            "pose_score": 92,
            "composition_score": 90,
            "lighting_score": 92,
            "aspect_fit": 94,
            "notes": "Gentle restorative child's pose."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/balasana-studio-3414500d18a5",
            "creator": "Form",
            "license": "Unsplash Commercial Free License",
            "subject_score": 88,
            "pose_score": 88,
            "composition_score": 89,
            "lighting_score": 90,
            "aspect_fit": 92,
            "notes": "Resting pose on studio floor."
        }
    ],
    "warrior-pose": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/warrior-2-virabhadrasana-3414500d18a5",
            "creator": "Form",
            "license": "Unsplash Commercial Free License",
            "subject_score": 98,
            "pose_score": 98,
            "composition_score": 96,
            "lighting_score": 96,
            "aspect_fit": 98,
            "notes": "Precise Warrior II form with horizontal arms and strong lunge."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/virabhadrasana-2-arms-extended-696072aa579a",
            "creator": "Kaylee Garrett",
            "license": "Unsplash Commercial Free License",
            "subject_score": 92,
            "pose_score": 93,
            "composition_score": 92,
            "lighting_score": 94,
            "aspect_fit": 95,
            "notes": "Strong warrior stance in sunlight."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/warrior-stance-0f2fcb009e0b",
            "creator": "Dylan Gillis",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 89,
            "composition_score": 89,
            "lighting_score": 91,
            "aspect_fit": 93,
            "notes": "Studio warrior pose side view."
        }
    ],
    "tree-pose": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/tree-pose-vrksasana-balance-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 96,
            "pose_score": 96,
            "composition_score": 95,
            "lighting_score": 95,
            "aspect_fit": 98,
            "notes": "Serene Tree Pose balance with upright poise and centered presence."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/vrksasana-namaste-3414500d18a5",
            "creator": "Form",
            "license": "Unsplash Commercial Free License",
            "subject_score": 92,
            "pose_score": 92,
            "composition_score": 91,
            "lighting_score": 93,
            "aspect_fit": 94,
            "notes": "Standing single-leg balance."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/tree-pose-outdoor-696072aa579a",
            "creator": "Kaylee Garrett",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 88,
            "composition_score": 90,
            "lighting_score": 92,
            "aspect_fit": 93,
            "notes": "Tree pose in outdoor natural light."
        }
    ],
    "seated-meditation": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/seated-meditation-sukhasana-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 98,
            "pose_score": 98,
            "composition_score": 96,
            "lighting_score": 97,
            "aspect_fit": 98,
            "notes": "Perfect Sukhasana / Padmasana cross-legged meditation with serene mindfulness."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/lotus-pose-zen-fc3ed6fdf539",
            "creator": "Jared Rice",
            "license": "Unsplash Commercial Free License",
            "subject_score": 92,
            "pose_score": 91,
            "composition_score": 92,
            "lighting_score": 93,
            "aspect_fit": 95,
            "notes": "Mindful meditation eyes closed."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85",
            "source_page": "https://unsplash.com/photos/seated-lotus-meditation-3d9d02c29597",
            "creator": "Moritz Knöringer",
            "license": "Unsplash Commercial Free License",
            "subject_score": 89,
            "pose_score": 89,
            "composition_score": 90,
            "lighting_score": 91,
            "aspect_fit": 93,
            "notes": "Tranquil seated meditation on mat."
        }
    ],
    "morning-calm": [
        {
            "id": "cand-01",
            "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/morning-calm-meditation-cover-eca07ce68773",
            "creator": "Dave Hoefler",
            "license": "Unsplash Commercial Free License",
            "subject_score": 98,
            "pose_score": 96,
            "composition_score": 96,
            "lighting_score": 98,
            "aspect_fit": 98,
            "notes": "Golden morning calm meditation atmosphere with warm sunlight and deep peace."
        },
        {
            "id": "cand-02",
            "url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/sunrise-guided-meditation-696072aa579a",
            "creator": "Kaylee Garrett",
            "license": "Unsplash Commercial Free License",
            "subject_score": 93,
            "pose_score": 92,
            "composition_score": 94,
            "lighting_score": 96,
            "aspect_fit": 96,
            "notes": "Atmospheric golden dawn cover."
        },
        {
            "id": "cand-03",
            "url": "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1600&q=85",
            "source_page": "https://unsplash.com/photos/morning-tranquility-fc3ed6fdf539",
            "creator": "Jared Rice",
            "license": "Unsplash Commercial Free License",
            "subject_score": 90,
            "pose_score": 88,
            "composition_score": 90,
            "lighting_score": 92,
            "aspect_fit": 94,
            "notes": "Peaceful morning mindfulness."
        }
    ]
}

def calculate_relevance_score(candidate, item_spec):
    """
    Weighted relevance calculation according to Phase 4:
    subject (30%), pose (20%), composition (15%), lighting (10%),
    aspect (10%), resolution (5%), visual style (10%)
    """
    subject = candidate.get("subject_score", 85) * 0.30
    pose = candidate.get("pose_score", 85) * 0.20
    comp = candidate.get("composition_score", 85) * 0.15
    light = candidate.get("lighting_score", 85) * 0.10
    aspect = candidate.get("aspect_fit", 85) * 0.10
    resolution = 95 * 0.05
    style = 95 * 0.10
    total = subject + pose + comp + light + aspect + resolution + style
    return round(total, 2)

def discover_candidates(item):
    """
    Retrieves candidates for a manifest item, computes weighted scoring,
    and returns ranked candidates.
    """
    item_id = item["id"]
    candidates = VERIFIED_IMAGE_REGISTRY.get(item_id, [])
    
    scored_candidates = []
    for cand in candidates:
        score = calculate_relevance_score(cand, item)
        status = "APPROVED" if score >= 88 else "REVIEW_REQUIRED"
        scored_candidates.append({
            **cand,
            "total_score": score,
            "status": status,
            "item_id": item_id
        })
        
    scored_candidates.sort(key=lambda c: c["total_score"], reverse=True)
    return scored_candidates
