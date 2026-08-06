// Trustpilot social proof — single source of truth.
//
// Displayed manually per Trustpilot's brand guidelines (accurate TrustScore +
// review count, linked to the profile). We deliberately do NOT emit this as
// AggregateRating/Review JSON-LD — self-serving review schema on our own
// Organization is against Google's guidelines (the compliant star-snippet path
// is Trustpilot's paid licensed TrustBox widget). HTML display only.
//
// score/count reflect the live Trustpilot profile as of 2026-08-06 (4.8, 92
// reviews). The reprinted reviews below are the set transcribed on 2026-06-19
// (53 of them); TRUSTPILOT.count is the true profile total and is deliberately
// NOT tied to how many we reprint (see note above TRUSTPILOT_REVIEWS). Names
// shortened to first name + last initial for privacy. `state` is set where the
// review explicitly names a state/exam (8 tagged) so state hubs can feature
// locally-relevant reviews. Refresh count/score here as reviews grow.

import { mentionsCompetitor } from "@/lib/testimonials";

export const TRUSTPILOT = {
  score: 4.8,
  count: 92,
  label: "Excellent", // Trustpilot descriptor for 4.5–5.0
  url: "https://www.trustpilot.com/review/justinsuranceco.com",
} as const;

export interface TrustpilotReview {
  name: string;
  initials: string;
  stars: number;
  date: string;
  text: string;
  /** Full state name when the review explicitly references one. */
  state?: string;
  /** True to keep this real review on the national /reviews page but exclude it
   *  from per-state filler — used when the text makes a course-specific claim
   *  (e.g. "the 60 hours course") that doesn't match any single state's offering. */
  excludeFromStateFiller?: boolean;
  /** Withhold this real review from display everywhere. Same contract as the
   *  flag of the same name in @/lib/testimonials: keep the record for
   *  provenance, never edit the reviewer's words. Pair with excludeReason. */
  excludeFromDisplay?: boolean;
  /** Why this record is withheld. Required whenever excludeFromDisplay is set. */
  excludeReason?: string;
}

// Raw, unfiltered. TRUSTPILOT_REVIEWS below is the filtered view the site reads.
// These are transcribed by hand from the live profile, so the named-competitor
// gate is applied here at the source: a future review that names a competitor
// is dropped on arrival rather than relying on whoever pastes it to notice.
const TRUSTPILOT_REVIEWS_RAW: TrustpilotReview[] = [
  { name: "Joel H.", initials: "JH", stars: 5, date: "2026-06-18", text: "Very clear step by step training and easy to understand! Passed my test!" },
  { name: "Ramona M.", initials: "RM", stars: 5, date: "2026-06-18", text: "I knew nothing about life and health insurance when I started this course. I learned a lot from watching the videos and reading the chapters. I passed the exam thanks to this course!" },
  { name: "Frances J.", initials: "FJ", stars: 5, date: "2026-06-17", state: "California", text: "I have received and appreciated the support from Just insurance and their tech support staff ever since I signed up for the Education and study materials and group study on March 1st, in stages, to June 15th 2026 when I took, and passed, the Life Accident Health & Sickness exam. I passed with a score of 91 out of a maximum score of 150. I prayed, and followed their guide and study suggestions. The required passing score in CA is 60-70 [editor's note: California's passing score is 60%], I was relieved when I read the words pass-after I completed the exam, and blown away when I reviewed my score. I am so appreciative for all the help and guidance I received from JustInsurance. Now I am a Licensed Professional Insurance Agent. My second act in life from being a Licensed Social Worker and Counselor. My reward for putting in the work and following directions. Special shoutout to Justin, Matt and Tech Support. Thank you with all my heart. You’re the best!!❤️🤗" },
  { name: "Kelly G.", initials: "KG", stars: 5, date: "2026-06-16", text: "Exceptional service, highly detailed and thorough training. I had used a different training program previously and there’s no comparison to JustInsurance. If you’re studying for the insurance exam look no further." },
  { name: "Rhonda B.", initials: "RB", stars: 5, date: "2026-06-15", text: "I had a great experience with JustInsurance. The support is amazing. I truly enjoyed the live sessions during the week, they are informative and helpful. I was able to pass on my first try. Now I’m looking forward to this amazing career" },
  { name: "Ryan", initials: "R", stars: 5, date: "2026-06-15", text: "Great experience! Passed my exam in a week after going the study materials and course. Very well laid out" },
  { name: "Karina", initials: "K", stars: 5, date: "2026-06-15", text: "JustInsurance was a major reason I was able to pass my Life Insurance exam. I loved the live sessions with Matt—he explains everything in a simple, practical way and the tips and tricks he shares are genuinely useful. The curriculum is well organized and easy to follow, and the practice tests were a game changer. They helped me identify my weak areas, improve my confidence, and understand the material in a way that actually prepares you for the exam. Overall, it was an awesome experience and I highly recommend JustInsurance to anyone studying." },
  { name: "Millicent T.", initials: "MT", stars: 5, date: "2026-06-14", text: "Just Insurance course…phenomenal!!! The instructor was great! He explains things in detail. This course is very easy to use. They are very responsive oh and encouraging!!! I just can’t say enough about this course! Ohhhh…!!! One more thing use the study videos and review your state laws they put it together for you..utilize it!! that’s how I studied & passed honestly! Many thanks for a seamless course! 💯🔥🫶🏽👏🏽💫🍾❤️" },
  { name: "Can B.", initials: "CB", stars: 5, date: "2026-06-13", text: "Very responsive, helpful and quick customer service. I have studied for a very short time and was able to pass the state exam at my first try. All thanks to JustInsurance. I have passed but I will keep studying, amazing platform. Highly recommended to everybody who is preparing for insurance exams." },
  { name: "Ernestas B.", initials: "EB", stars: 5, date: "2026-06-12", text: "I was able to pass my state and general exam first try! The course was very similar to the exam questions and topics." },
  { name: "Qiana R.", initials: "QR", stars: 5, date: "2026-06-11", text: "I've truly enjoyed my learning experience with JustInsurance. This is a whole new experience for me, changing careers going into insurance. JustInsurance has been so supportive in helping me with every step of this process. It's so much that I can't explain it all. I'm so happy and excited because I passed my Life exam today. Justin and Matt are great! The live sessions, the videos, study guides, practice tests, everything that they teach, and push you to learn do it! I'm so excited about this new chapter in my life. Thank you, JustInsurance." },
  { name: "Michael W.", initials: "MW", stars: 5, date: "2026-06-11", text: "Just insurance LLC is definitely top tier. The layout for the courses are super easy to understand and the delivery of the material is well explained. One of my favorite things is how fast their support team is there to help within a couple minutes. Thank you Just Insurance. I PASSED MY EXAM!!!" },
  { name: "Zaida H.", initials: "ZH", stars: 5, date: "2026-06-11", text: "The course was exceptional it helped me prepare for the state exam and answered any questions during the course at any time. They provided endless support ." },
  { name: "Kisha E.", initials: "KE", stars: 5, date: "2026-06-10", state: "Florida", text: "Just Insurance delivered an outstanding prep course for the Florida 2-15 Life, Health & Annuity exam. The content was thorough and well-organized, and the layout was very user-friendly — I never felt lost or overwhelmed. I went into my exam feeling prepared and confident, and I passed on my very first attempt! If you want a course that actually prepares you, this is it. Highly recommend!" },
  { name: "Lance T.", initials: "LT", stars: 5, date: "2026-06-10", text: "A great product. The customer service is first class when you needed assistance. I 100% recommend this product to people interested in the field" },
  { name: "Nick", initials: "N", stars: 5, date: "2026-06-10", text: "The course was easy to follow , extremely informative and the practice tests were spot on the state exam. Turned complicated language into basic understanding and easy to comprehend material !!!! Home run course !!!!" },
  { name: "Lurma S.", initials: "LS", stars: 5, date: "2026-06-10", text: "My experience was wonderful. The encouraging email kept me focus when I was tired. The materials really prepared me for the exam. I felt confident going into the exam room. Thank you for your help in my passing the exam the first time." },
  { name: "Elbarra M.", initials: "EM", stars: 5, date: "2026-06-10", text: "It was easy to use and learn. I recommend it anyone doing an insurance exam!" },
  { name: "Minnepeg & Cam", initials: "MC", stars: 5, date: "2026-06-08", state: "Illinois", text: "Passed both my Health and Life exams on the first attempt. It took me one week to complete the coursework and pass the program practice exams before I booked my pre-license exams. The program is incredibly thorough and breaks down complicated topics into bite size pieces which pretty much ensures your success if you put your time in! Justin is EXTREMELY easy to follow, personable, and not pretentious at all which can be a downside of instructors in financial education. Don’t sleep on Matt’s livestreams either- really pay attention and ask him questions- he really knows his stuff and can help you apply a real world example from his life to an abstract concept you may be struggling to fully understand. I HIGHLY RECOMMEND attending as many of his Saturday livestreams as you have between signing up for the course and taking your exams." },
  { name: "Briana M.", initials: "BM", stars: 5, date: "2026-06-05", state: "North Carolina", text: "This course was great! So helpful and easy to follow. I personally dont learn from reading a bunch of materials so I appreciated the videos. I had them playing in the car, while cleaning, while going on a walk, etc and listening to the videos a few times through gave me what I needed to pass my North Carolina state exam!" },
  { name: "Seble D.", initials: "SD", stars: 5, date: "2026-06-05", text: "I passed the exam on the first attempt. I had a great experience" },
  { name: "Rock S.", initials: "RS", stars: 5, date: "2026-06-04", text: "Hi everybody, just insurance is the best. I'm 72 years old, and I haven't worked for a while. I was studying for my new employment, and then the internet started acting a fool, not opening up my study page, just insurance. I was terrified because I only had a few days to study, and I was in fear I would lose study time. Justinsurance support reassured me we got you. I love you guys and girls. I passed. Thank you, Jehovah God, and just insurance. Jay Land (jimmy)" },
  { name: "Angela H.", initials: "AH", stars: 5, date: "2026-06-04", text: "JustInsurance has been a huge help and incredibly gracious and supportive during my Health and Life Insurance journey. Just trust the process. Honestly, it’s hard and overwhelming at first, but the knowledge keeps building through repetition. Keep going and you will get licensed!" },
  { name: "Edreese M.", initials: "EM", stars: 5, date: "2026-06-04", text: "Passed both my life and health exams with ease! Material will definitely get you prepared and the exam study guide makes it easy if you follow the steps. I felt zero nerves taking state exam and finished both quickly feeling I knew everything asked. Highly recommend!" },
  { name: "Patrick", initials: "P", stars: 5, date: "2026-06-03", text: "The material and live sessions were very helpful. I passed the exam on my first try." },
  { name: "William F.", initials: "WF", stars: 4, date: "2026-06-03", text: "they had pertty good circiulium I was abele to reenew my liescence with bit of work." },
  { name: "Kimberly G.", initials: "KG", stars: 5, date: "2026-06-03", state: "Arkansas", text: "JustInsurance provides comprehensive courses. It was really easy for me to retain what I learned and I passed my AR Life Producer exam on the first try! (I've heard it's a 50/50 shot on average). I really appreciate their teaching style." },
  { name: "Joshua P.", initials: "JP", stars: 5, date: "2026-06-02", state: "Georgia", text: "It was a very great experience overall. I passed my exam in Georgia and I believe this course really helped me prepare for that exam." },
  { name: "Shop", initials: "S", stars: 5, date: "2026-06-02", text: "Helpful in every way possible" },
  { name: "Brett B.", initials: "BB", stars: 4, date: "2026-06-01", text: "Passed on my first try. Would recommend Just Insurance for your study material." },
  { name: "Verified Customer", initials: "VC", stars: 5, date: "2026-05-30", text: "the people available to help were quick, efficient, detailed, patient, and very caring. I passed my test with confidence because of them." },
  { name: "AJ M.", initials: "AM", stars: 5, date: "2026-05-30", text: "Excellent program and efficient training materials to get licensed. If you follow the program you will pass your license in the first try!!!" },
  { name: "Sara F.", initials: "SF", stars: 5, date: "2026-05-30", text: "This course was very thorough and easy to navigate. I was able to pass my state exam on the first try and I believe that is due to this course." },
  { name: "Michael S.", initials: "MS", stars: 5, date: "2026-05-29", text: "Was able to take the course and pass my exam within a couple weeks! Amazing course, loved the videos explaining everything" },
  { name: "Ginger G.", initials: "GG", stars: 5, date: "2026-05-29", state: "North Carolina", text: "Easily five stars! I've been out of school for YEARS. My only experience with insurance before this course was with my own limited life experiences. JI provided everything I needed to help me pass my NC state exams for Life + Health. They answered all my silly questions and helped me every step of the way. Take advantage of the live study sessions. It really helps in nailing down concepts that help you then test well. This company was such great support from start to finish. Thank you. - Forever grateful from North Carolina." },
  { name: "Yvonne H.", initials: "YH", stars: 5, date: "2026-05-29", text: "I found the material to be well put together and very easy to follow. The support team is very attentive and encouraging. I passed my state's license exam on the first attempt with ease and finished in less than an hour. I am well prepared to start my new career as an insurance agent and thank JustInsurance LLC for getting me there." },
  { name: "Justin", initials: "J", stars: 5, date: "2026-05-29", text: "Must needed" },
  { name: "Cameron S.", initials: "CS", stars: 5, date: "2026-05-27", text: "Great and very informational pre-licensing course! Helped me pass my state exam, with room to spare! Although the test was a tad bit harder, if you go over the material and complete the pre-exam with videos and flash cards, and take the practice exams over and over, and score 80 or better each time, you will be prepared for the state exam!" },
  { name: "Jordan A.", initials: "JA", stars: 5, date: "2026-05-27", text: "So happy to say that I passed my life insurance exam after using this source. It was very easy to understand and navigate, and was filled loads of information that was all on the exam I would recommend to anybody who is in need in life insurance prep" },
  { name: "Jesus R.", initials: "JR", stars: 5, date: "2026-05-26", excludeFromStateFiller: true, text: "I took the 60 hours course. I like the fact that it is in parts, you have vocabulary, videos, terms and summary, as well as a quiz at the end, I was able to complete the course and pass my state test on the first try, I will suggest, do not skip parts because it could become very confusing, also, they were really helpful when it came to the next steps, they provided me with link and what to do next." },
  { name: "Kaleb C.", initials: "KC", stars: 5, date: "2026-05-26", text: "Site layout and UI is extremely user-friendly. There is a lot of material, but it is covered in detail and in several ways to ensure that you’re able to comprehend the information. Their support team is on the ball and I always got a prompt reply that completely resolved any issues or questions I had. I took this course and I passed my exam first try and way ahead of the time limit. I have JustInsurance LLC to thank for the success!" },
  { name: "GOD’S D.", initials: "GD", stars: 5, date: "2026-05-24", text: "This was a very great experience. They’re very thorough and willing to make sure you pass your exam on the first try, which I love. I passed my exam on the first try. The level of support is just everything." },
  { name: "Madeline F.", initials: "MF", stars: 5, date: "2026-05-21", text: "I passed my state exam after 2 weeks of studying in this course. This course breaks everything down nicely for newbies to insurance concepts so all the information can be absorbed easily. I found a few typos here and there, but nothing major enough to make the information hard to understand. There is plenty of repetition in the modules to assist with retention. Highly recommend this course!" },
  { name: "Brogan", initials: "B", stars: 5, date: "2026-05-20", text: "Great team, great instructors, the information is laid out so simply, powerfully, and professionally that anyone can understand and do it. If you’re hesitant don’t be, the information here will give you exactly what you need." },
  { name: "Jennifer B.", initials: "JB", stars: 5, date: "2026-05-19", text: "great course wonderful customer service" },
  { name: "Nina", initials: "N", stars: 5, date: "2026-05-18", text: "I was so glad I found this company as I was scrolling down on YouTube. I took the paid review. I was pretty happy with the gradient that they use and the definitions of terms. Today, I passed the Insurance test first time. I highly recommend the company. Thank you so much." },
  { name: "Juan G.", initials: "JG", stars: 5, date: "2026-05-16", text: "Very good structured course that if followed as instructed will make any one pass the exams" },
  { name: "Darsana", initials: "D", stars: 5, date: "2026-05-16", text: "This course was perfect! The material is highly organized and taught through a mix of videos, classes, and writing assignments. Their strategy of repeating core information throughout the program really works—it helped me study so effectively that I passed the state exam on my first attempt. I also can't thank their support team enough; when I had an issue with a requirement, they immediately extended my time and sorted it out. Highly recommend!" },
  { name: "Briona H.", initials: "BH", stars: 5, date: "2026-05-14", text: "I passed my exam on the first try ! If you genuinely go through the course and utilize the tools/study guides provided you are bound to pass !" },
  { name: "Doreen M.", initials: "DM", stars: 5, date: "2026-05-14", text: "I passed with 89% first time! The course was very easy to follow and incredibly thorough. Every type of learning style is utilized. If you follow the course exactly, you WILL pass the state license exam. I also took advantage of some of the live sessions as well. Thank you!" },
  { name: "Jamie S.", initials: "JS", stars: 5, date: "2026-05-13", state: "Connecticut", text: "Justin's study material on YouTube gave me the information, time and confidence to get through my study material, my practice exams and passing my CT Life Insurance producers exam! This is the best help you could ever want!" },
  { name: "Kirk H.", initials: "KH", stars: 5, date: "2026-05-12", text: "JustInsurance has been an incredible help for me in regards to me passing my life insurance state exam. The modules are easy to follow and the course can either be done through reading the material or of videos or a combination of the two which is what I did. Because of JustInsurance I was able to pass my state licensing exam on the first try within 3 weeks of studying for it. 10/10 would recommend the platform to anyone who’s interested in becoming an agent for life or health." },
  { name: "Braden R.", initials: "BR", stars: 5, date: "2026-05-08", text: "Great company! Got me through my Health and Life pre-course as well as passing my state exam first try. The exam prep material is updated regularly making it easy!" },
];

/**
 * Displayable Trustpilot reviews — the single list the site renders.
 *
 * Reuses mentionsCompetitor() from @/lib/testimonials rather than restating the
 * pattern list, so there is exactly one definition of "names a competitor"
 * across the site and adding a company there covers Trustpilot too.
 *
 * Note: TRUSTPILOT.count (92) is deliberately NOT recomputed from this array.
 * It reports how many reviews exist on the public Trustpilot profile, which is
 * what "Rated 4.8 out of 5 based on 53 reviews" asserts and what the score is
 * actually calculated from. It stays true regardless of how many we reprint.
 */
export const TRUSTPILOT_REVIEWS: TrustpilotReview[] = TRUSTPILOT_REVIEWS_RAW.filter(
  (r) => r.excludeFromDisplay !== true && !mentionsCompetitor(r)
);

// Deterministic per-state PRNG (xmur3 seed -> mulberry32) for a stable shuffle,
// so each state gets a distinct-but-stable ordering (no hash-collision twins).
function seededShuffle<T>(seed: string, items: T[]): T[] {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = (h ^= h >>> 16) >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Return up to `n` reviews for a state hub: state-matched reviews first, then a
// deterministic per-state shuffle of STATELESS reviews. Filler is stateless only,
// so a review tagged for another state never shows on the wrong page, and the
// shuffle (seeded by state name) gives each state a distinct, stable set.
// Display-only; no schema.
export function getTrustpilotForState(stateName: string, n = 3): TrustpilotReview[] {
  const lc = stateName.toLowerCase();
  const matched = TRUSTPILOT_REVIEWS.filter(
    (r) => r.state && r.state.toLowerCase() === lc
  );
  const fillerPool = TRUSTPILOT_REVIEWS.filter(
    (r) => !r.state && r.text.length >= 70 && !r.excludeFromStateFiller
  );
  const result = [...matched];
  for (const r of seededShuffle(stateName, fillerPool)) {
    if (result.length >= n) break;
    result.push(r);
  }
  return result.slice(0, n);
}
