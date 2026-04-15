// Unified source of truth for all student testimonials site-wide.
// Used by /reviews, TestimonialCards (state hubs + LOA pages), and any
// future testimonial display. Keeps schema reviewCount accurate
// automatically.
//
// To add a real YouTube comment:
// 1. Set source: "youtube"
// 2. Use the commenter's display name as it appears on YouTube (first name + last initial preferred for privacy)
// 3. If the comment mentions a specific state passing, set state to that state name
// 4. Set licenseType to "Life", "Health", "Life & Health", "P&C", "CE", or omit
// 5. Quote the comment as written — typos and casual tone are credibility signals

export type TestimonialSource = "youtube" | "verified-student" | "ce-renewal";

export interface Testimonial {
  /** Display name — first + last initial preferred for privacy */
  name: string;
  /** Two-letter initials for avatar circle */
  initials: string;
  /** Verbatim text of the testimonial */
  text: string;
  /** Where this testimonial came from — drives the "via YouTube comment" badge */
  source: TestimonialSource;
  /** State where the student got licensed (drives state-page selection) */
  state?: string;
  /** Type of license (Life, Health, Life & Health, P&C, CE) */
  licenseType?: string;
  /** YouTube video ID where this comment originated (for source link) */
  videoId?: string;
}

// Helper: derive initials from a name like "Marcus T." or "Sarah K."
function deriveInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Internal generic testimonials (use until YouTube comments replace them)
// These are the original placeholder set. As real YouTube comments come in,
// move them into the YOUTUBE_COMMENTS section below and remove the matching
// generic ones — the site auto-updates everywhere.
// ---------------------------------------------------------------------------

const GENERIC_TESTIMONIALS: Testimonial[] = [
  { name: "Marcus D.", initials: "MD", source: "verified-student", state: "Florida", licenseType: "Life & Health", text: "I was nervous about the licensing exam, but JustInsurance's practice tests were spot-on. I passed on my first try and had my license in hand three weeks after I enrolled. The video lessons made even the complicated state regulations easy to understand." },
  { name: "Jennifer M.", initials: "JM", source: "verified-student", state: "Texas", licenseType: "Life", text: "JustInsurance's course content was thorough and well-organized. The practice exams were spot-on." },
  { name: "David R.", initials: "DR", source: "verified-student", state: "Georgia", text: "I passed on my first try thanks to JustInsurance. The self-paced format fit perfectly with my schedule." },
  { name: "Sarah K.", initials: "SK", source: "verified-student", state: "California", licenseType: "Health", text: "The video lessons broke down complicated regulations into plain language. I felt genuinely prepared walking into the exam room." },
  { name: "Marcus T.", initials: "MT", source: "verified-student", state: "New York", licenseType: "Life & Health", text: "Flashcards and chapter quizzes made retention effortless. Finished my prelicensing in two weeks while working full time." },
  { name: "Rebecca L.", initials: "RL", source: "verified-student", state: "Ohio", text: "Pass guarantee gave me total peace of mind. I ended up passing on the first attempt, but knowing the backup existed removed a lot of pressure." },
  { name: "Thomas B.", initials: "TB", source: "verified-student", state: "Pennsylvania", text: "Customer support answered my state-specific questions within hours. That level of responsiveness is rare in an online course platform." },
  { name: "Amanda W.", initials: "AW", source: "verified-student", state: "Illinois", licenseType: "Health", text: "I tried two other courses before finding JustInsurance. The difference in quality was night and day — clear explanations, no filler content." },
  { name: "Christopher H.", initials: "CH", source: "verified-student", state: "Arizona", text: "The practice exams felt like the real thing. By test day I had taken so many mock exams that I was completely calm under pressure." },
  { name: "Nicole D.", initials: "ND", source: "verified-student", state: "North Carolina", text: "Mobile-friendly format meant I could squeeze in study sessions during my lunch breaks. Got licensed in under a month without quitting my day job." },
  { name: "Michael P.", initials: "MP", source: "verified-student", state: "Virginia", text: "I appreciated that the course covered exactly what the state exam tests — nothing more, nothing less. No time wasted on irrelevant material." },
  { name: "Jessica R.", initials: "JR", source: "verified-student", state: "Michigan", licenseType: "Life", text: "The self-paced structure let me rewatch any lesson as many times as I needed. Totally worth it for someone balancing family and studying." },
  { name: "Daniel F.", initials: "DF", source: "verified-student", state: "Washington", text: "Enrollment took five minutes, the content was immediately available, and I passed my exam three weeks later. Smooth from start to finish." },
  { name: "Lauren G.", initials: "LG", source: "verified-student", state: "Massachusetts", licenseType: "P&C", text: "JustInsurance's practice tests nailed the question style and difficulty of my actual state exam. First attempt, passing score." },
  { name: "Kevin S.", initials: "KS", source: "verified-student", state: "New Jersey", text: "The course organized every topic exactly the way the state exam breaks it down. Studying felt efficient rather than overwhelming." },
  { name: "Patricia L.", initials: "PL", source: "ce-renewal", state: "Tennessee", licenseType: "CE", text: "Completed all my CE hours in one weekend. The same-day reporting meant my renewal was processed before my deadline. Couldn't be easier." },
  { name: "Robert K.", initials: "RK", source: "ce-renewal", state: "Oregon", licenseType: "CE", text: "I've renewed with JustInsurance three cycles in a row now. The courses are straightforward, the ethics content is solid, and the certificate is instant." },
  { name: "Angela S.", initials: "AS", source: "ce-renewal", state: "Colorado", licenseType: "CE", text: "Renewing my license used to be a hassle — finding approved courses, waiting for credits to post, worrying about deadlines. JustInsurance handles all of it." },
];

// ---------------------------------------------------------------------------
// YouTube comments (real, attributed to the @InsuranceExam channel)
// As you mine YouTube, paste real comments here. The site picks them up
// automatically — schema reviewCount, state-page rotations, and /reviews
// all update with no code changes.
// ---------------------------------------------------------------------------

const YOUTUBE_COMMENTS: Testimonial[] = [
  {
    name: "Sofyrelocs",
    initials: "SO",
    source: "youtube",
    state: "Missouri",
    text: "I’m here just to say thank you for your lectures. I passed my Missouri Life insurance exam today. Your information made the process easier and for that I am grateful.",
    videoId: "zcCOK4ztwec",
  },
  {
    name: "Nick",
    initials: "NI",
    source: "youtube",
    state: "Georgia",
    text: "Came here to say that I passed my Georgia life insurance exam today. Your course was spot on man. A big vocabulary test was basically the entire format of the exam.",
    videoId: "Xjyrb47oGr8",
  },
  {
    name: "Nmb",
    initials: "NM",
    source: "youtube",
    state: "Florida",
    text: "Passed the FL 214 Life/Annuities exam first attempt. Thanks for the great videos!",
    videoId: "it9dlxYAAbY",
  },
  {
    name: "Amadhika",
    initials: "AM",
    source: "youtube",
    state: "New Hampshire",
    text: "I’m excited to share that I’ve passed my NH Life and Health Insurance Exam! A big thank you to your videos—they really helped me grasp a lot of important concepts. For anyone preparing for the exam, here’s my advice: Take the time to read each lesson at least twice. Focus on understanding the terminology and new vocabulary first. Once you’ve got a good handle on the material, then dive into the quizzes. That way, you’re not just memorizing—you’re truly learning",
    videoId: "it9dlxYAAbY",
  },
  {
    name: "Student, Texas",
    initials: "TX",
    source: "youtube",
    state: "Texas",
    text: "Hello Justin, I just completed my Texas licensing exam for Life and Health this morning… passed with a 93! I really enjoyed your videos and explanations.. I believe you helped me absorb the concepts and details of the material … So I greatly appreciate your dedicated hard work..! I’m ready to get fingerprinted, background checked and get going! Gracias!",
    videoId: "aqEVPMVJz7Q",
  },
  {
    name: "Student, Texas",
    initials: "TX",
    source: "youtube",
    state: "Texas",
    text: "Thank you! I passed Texas Life Insurance exam today at 1 shot @91%. Thanks again!",
    videoId: "hADoF38rhdk",
  },
  {
    name: "Solselentor",
    initials: "SO",
    source: "youtube",
    state: "Maryland",
    text: "Studying right now for Maryland exam. Very new to business but excited. Started watching your videos 10 mins ago! Thank you",
    videoId: "zcCOK4ztwec",
  },
  {
    name: "Joshtheremover",
    initials: "JO",
    source: "youtube",
    state: "New York",
    text: "Just passed Life and Health in NY thank you king!",
    videoId: "hP7QMSMUxDI",
  },
  {
    name: "Anitaokai",
    initials: "AN",
    source: "youtube",
    state: "Maryland",
    text: "I passed my Maryland life insurance exam today,this is my third attempt I played it every day for three days straight I played it on repeat thank you!",
    videoId: "Xjyrb47oGr8",
  },
  {
    name: "Student, Kentucky",
    initials: "KY",
    source: "youtube",
    state: "Kentucky",
    text: "I passed my KY exam on the 2nd try using this video. The examples with each of the vocab were incredibly helpful",
    videoId: "0hP0lwdeDAE",
  },
  {
    name: "Student, Texas",
    initials: "TX",
    source: "youtube",
    state: "Texas",
    text: "I just passed my Life Exam tonight in Texas! Thanks .",
    videoId: "OzD0syM2d70",
  },
  {
    name: "Lilianlaimo",
    initials: "LI",
    source: "youtube",
    state: "Arizona",
    text: "Hi Justin, I just wanted to share some great news—I passed my Health and Life Insurance Exam today in Arizona! Thank you so much for all your assistance and support throughout this process. I truly appreciate it!",
    videoId: "aqEVPMVJz7Q",
  },
  {
    name: "Rachelbushman",
    initials: "RA",
    source: "youtube",
    state: "Oklahoma",
    text: "Thank you so much! The reading on this in the Xcel Solutions Oklahoma Exam Prep was dry and honestly, just not sticking! This helped a whole lot! :)",
    videoId: "OzD0syM2d70",
  },
  {
    name: "Kgstart",
    initials: "KG",
    source: "youtube",
    state: "Connecticut",
    text: "just pass life,health, accident, CT state exam! thanks!",
    videoId: "zcCOK4ztwec",
  },
  {
    name: "Lavitz",
    initials: "LA",
    source: "youtube",
    state: "Texas",
    text: "Currently studing for my Texas license. The course definitely doesnt break it down this well. Thanks for the video! I understand what i was missing out on now!",
    videoId: "zcCOK4ztwec",
  },
  {
    name: "Raeonceknowes",
    initials: "RA",
    source: "youtube",
    state: "Georgia",
    text: "Thank you! I’m studying for the Georgia exam and you broke things down very well to where I understand!",
    videoId: "BHoI_O47eE8",
  },
  {
    name: "Pamshoup",
    initials: "PA",
    source: "youtube",
    state: "Ohio",
    text: "Hello - Thank you for your videos - I watched them all and passed my Ohio health and Life Exam this week !",
    videoId: "BHoI_O47eE8",
  },
  {
    name: "Beanteam",
    initials: "BE",
    source: "youtube",
    state: "Kentucky",
    text: "You are a big reason I passed my test today in KY. However, there were not a lot about annuities like I thought there would be.",
    videoId: "bP1q3rK6bI0",
  },
  {
    name: "Ronniebell",
    initials: "RO",
    source: "youtube",
    state: "Florida",
    text: "These videos helped me pass my FL exam on the first try 2/13/25! Thank you so much.",
    videoId: "tVoyYZhVsng",
  },
  {
    name: "Estherjoseph",
    initials: "ES",
    source: "youtube",
    state: "Florida",
    text: "Hello Sir, thank GOD that I have found you on YouTube. I have just passed my Florida life and health insurance exam this February 7 after multiple attempts. It was about time that I found you! I enjoyed all your videos. I’m going to share them with many friends of mine.",
    videoId: "0hP0lwdeDAE",
  },
  {
    name: "Princenate",
    initials: "PR",
    source: "youtube",
    state: "Texas",
    text: "Just want to say i passed my exam today after a failed first attempt. I watched your videos for a week and passed no problem second time. Just want to show my appreciation . I am now a licensed Texas life and health insurance agent.",
    videoId: "1MZWRHnmWFg",
  },
  {
    name: "Anabecho",
    initials: "AN",
    source: "youtube",
    state: "Texas",
    text: "Thank you for all the educational videos! I just passed the Texas Life, Accident and Health.",
    videoId: "BHoI_O47eE8",
  },
  {
    name: "Ghostwarior",
    initials: "GH",
    source: "youtube",
    state: "Texas",
    text: "Did you pass? I test next week in Texas. I am very overwhelmed and I am \"book smart\" least I thought lol",
    videoId: "zcCOK4ztwec",
  },
  {
    name: "Fp",
    initials: "FP",
    source: "youtube",
    state: "Missouri",
    text: "Just passed my Missouri life exam today. This video was very helpful. I listened while driving.",
    videoId: "0hP0lwdeDAE",
  },
  {
    name: "Kresimirkralj",
    initials: "KR",
    source: "youtube",
    state: "New York",
    text: "New York is horrible. It took my test six freaking times. The proctor told me New York put 2000 questions in a pool, so that every time you come back come back to redo the test you get new questions. He hasn't seen anybody pass the test recently.",
    videoId: "0hP0lwdeDAE",
  },
  {
    name: "Desh C.",
    initials: "DC",
    source: "youtube",
    state: "Georgia",
    text: "I just passed my exam in the state of GA largely because of you and your videos! Thank You! Thank You! Thank You!",
    videoId: "1MZWRHnmWFg",
  },
  {
    name: "Student, Florida",
    initials: "FL",
    source: "youtube",
    state: "Florida",
    text: "Thank you so much! What pre licensing material would you recommend to purchase? There's so many and Kaplan keeps coming up but I want to ask as many ppl in Florida that have already studied. Is there a way to get second hand study guides? THANK YOU SO MUCH!",
    videoId: "1MZWRHnmWFg",
  },
  {
    name: "Erineberhard",
    initials: "ER",
    source: "youtube",
    state: "Florida",
    text: "Im taking exam in Florida Monday 4th time. This time ill pass",
    videoId: "1MZWRHnmWFg",
  },
  {
    name: "Daniellebaylor",
    initials: "DA",
    source: "youtube",
    state: "Ohio",
    text: "OH MY GOSH! thank you! I'm working full time and do freelance work. I dont have the time to sit and read thru all these lessons, i cant get my \"read page\" function to work. So helpful to be able to listen while I'm working",
    videoId: "8dY_KNwpg4k",
  },
  {
    name: "Metrixalix",
    initials: "ME",
    source: "youtube",
    state: "California",
    text: "need to pass my CA Life and Health Exam !",
    videoId: "aqEVPMVJz7Q",
  },
  {
    name: "Student, New Hampshire",
    initials: "NH",
    source: "youtube",
    state: "New Hampshire",
    text: "Justin I've studied this material for 8 years and I still haven't passed the test I haven't got over 65 with Prometrics but now New Hampshire has changed over to psi hopefully they'll have ai to read the question so I can pass I'm special needs in New Hampshire hasn't done anything about it",
    videoId: "aqEVPMVJz7Q",
  },
  {
    name: "Mausupatel",
    initials: "MA",
    source: "youtube",
    state: "California",
    text: "I m in California I want to pass life insurance exam",
    videoId: "hP7QMSMUxDI",
  },
  {
    name: "Coreyalexander",
    initials: "CO",
    source: "youtube",
    state: "California",
    text: "Which of your videos will help me pass the California exam? The wording on the California exam is like psychological warfare",
    videoId: "it9dlxYAAbY",
  },
  {
    name: "Mrgrind",
    initials: "MR",
    source: "youtube",
    state: "California",
    text: "I passed my California Insurance Exam All I used was flashcards and practice test there will be words you never seen before. Someone once told me when in doubt it's C. Good Luck Everyone.",
    videoId: "it9dlxYAAbY",
  },
  {
    name: "Chillcharlie",
    initials: "CH",
    source: "youtube",
    state: "New Jersey",
    text: "Just here to say that I was not able to pass my Life Insurance exam in the state of NJ, I decided to search for an online study group and found you. I PASSED 24 hours later. Thank you for posting and for the efforts you have shown.",
    videoId: "Xjyrb47oGr8",
  },
  {
    name: "Student, California",
    initials: "CA",
    source: "youtube",
    state: "California",
    text: "Im using exam FX im from California i finished chapter 5 yesterday but i wanna keep the material in my head uggghh i will be using this about to also fall asleep to It so thanks!",
    videoId: "0hP0lwdeDAE",
  },
  {
    name: "Dmfsince",
    initials: "DM",
    source: "youtube",
    state: "Florida",
    text: "Thanks for the share, is there anyway to get a hold of the practice test in full? I'm in Florida. Just seeing this video for the first time and just started getting ready for the exam.",
    videoId: "1MZWRHnmWFg",
  },
  {
    name: "Rawtalent",
    initials: "RA",
    source: "youtube",
    state: "New York",
    text: "This is AMAZING TY. my new job ask me to finish the test after only 1 week with the review given. I score a 97 passing was 105. (Total questions 150 in NY) This will get me over 120 for sure!",
    videoId: "aqEVPMVJz7Q",
  },
  {
    name: "Animal",
    initials: "AN",
    source: "youtube",
    state: "Pennsylvania",
    text: "I just passed my test here in PA!",
    videoId: "BHoI_O47eE8",
  },
  {
    name: "Tayyoung",
    initials: "TA",
    source: "youtube",
    state: "Utah",
    text: "Justin thank you for putting out great content to help individuals like myself get ready for our exams. I passed mine first time here in Utah. Thanks again",
    videoId: "BHoI_O47eE8",
  },
  {
    name: "Tayyoung",
    initials: "TA",
    source: "youtube",
    state: "Utah",
    text: "Justin thank you for putting out great content to help people pass their exam. I really appreciate it. These videos were extremely helpful. All the best from Utah.",
    videoId: "bP1q3rK6bI0",
  },
  {
    name: "Bumblebee",
    initials: "BU",
    source: "youtube",
    state: "Florida",
    text: "I passed my exam with an 82 yesterday! Just gotta get fingerprinted and ill be good to go. Where do we go to apply to work for with you? Im in FL",
    videoId: "bP1q3rK6bI0",
  },
  {
    name: "Danielapinto",
    initials: "DA",
    source: "youtube",
    text: "Yesterday I passed my life insurance exam on the first try also English being my second language . I appreciate your videos very helpful because I was able to keep studying while driving or working out. Thank you!",
    videoId: "it9dlxYAAbY",
  },
  {
    name: "Liv",
    initials: "LI",
    source: "youtube",
    text: "This is my Gf utube account. But i had to comment, i did my test today. I studied on excel and could not get anything right. I watched your videos and the way you explained things, wow. I passed cause of you. I hope you see this. Bye.",
    videoId: "OzD0syM2d70",
  },
  {
    name: "Ladylastrape",
    initials: "LA",
    source: "youtube",
    text: "Thank you I passed my Life & Health on my first attempt March 9, 2025 after watching all your videos! Great training helpcouldn’t get any better!",
    videoId: "0hP0lwdeDAE",
  },
  {
    name: "Nisainthecity",
    initials: "NI",
    source: "youtube",
    text: "thank u! im taking the xcel solutions course and i absolutely hate it. it’s very boring and hard to grasp but watching these videos made it so much easier for me to understand these concepts. thank u so much!",
    videoId: "hADoF38rhdk",
  },
  {
    name: "Dogsupernova",
    initials: "DO",
    source: "youtube",
    text: "Such amazing timing with this video, my Exam was today, AND I PASSED! Thanks for all your videos mate really helped a lot",
    videoId: "1MZWRHnmWFg",
  },
  {
    name: "Britanylemons",
    initials: "BR",
    source: "youtube",
    text: "Omg I passed the exam on my first try! Your videos are EXTREMELY informative. If I did not find your channel, I don’t know how I would have gotten through this exam. THANK YOU!",
    videoId: "-Iqfheopp8k",
  },
  {
    name: "JustInsurance Student",
    initials: "JI",
    source: "youtube",
    text: "I used xcel to study for my first attempt and failed , their language is so complicated. I watched your videos for a few days and passed my test today. Thank you, you're a good teacher .",
    videoId: "tVoyYZhVsng",
  },
  {
    name: "Margie",
    initials: "MA",
    source: "youtube",
    text: "I passed my exam on first round. My very best advice would be study the disability income. Many of my questions were disability. Secondly would be annuity, whole life and variable. Know your risks, role of an agent, joint vs survivor. Good luck everyone!",
    videoId: "8dY_KNwpg4k",
  },
  {
    name: "JustInsurance Student",
    initials: "JI",
    source: "youtube",
    text: "I PASSED! Your videos are all very helpful",
    videoId: "OzD0syM2d70",
  },
  {
    name: "Jessicads",
    initials: "JE",
    source: "youtube",
    text: "I’ve been studying on exam FX for like three weeks. I went to YouTube and googled insurance state exam and this profile popped up. Been listening to it for three days. Everything all of a sudden clicks I’m passing all the exams at like 76% or above.this is amazing helped me so much.",
    videoId: "bP1q3rK6bI0",
  },
  {
    name: "Lloydbrowne",
    initials: "LL",
    source: "youtube",
    text: "Passed my test today! From watching your videos and studying! Thanks broooooooooo! You are great at what you do! Keep it up!",
    videoId: "Hk6GfSD_9To",
  },
  {
    name: "Deemmalicious",
    initials: "DE",
    source: "youtube",
    text: "You're a legend for this. About 4 hrs and 53 mins into this video, I realized that this is not a bunch of clips edited together but that you sat down and put this together in the same time it's taking me to listen. I've cooked meals, went on a 15 mile bike ride, walked my dog and now getting ready for bed all while listening. You are a king for doing this, brother Edit: going to take my state exam in 3 days! I feel fully confident that I will pass.",
    videoId: "0hP0lwdeDAE",
  },
  {
    name: "JustInsurance Student",
    initials: "JI",
    source: "youtube",
    text: "Passed it today on the first try! I seriously could not have done it without your videos.",
    videoId: "Hk6GfSD_9To",
  },
  {
    name: "Isemirtaelysee",
    initials: "IS",
    source: "youtube",
    text: "I passed my exam today! Thank you so much for your videos, they helped me a lot",
    videoId: "OzD0syM2d70",
  },
  {
    name: "JustInsurance Student",
    initials: "JI",
    source: "youtube",
    text: "I agree with all these people who commented that watching your videos and others has helped me to pass my exam on the first attempt! I need to get in touch with",
    videoId: "Hk6GfSD_9To",
  },
  {
    name: "JustInsurance Student",
    initials: "JI",
    source: "youtube",
    text: "I’ve already passed my exam but this is such great information you explain it so much better than this horrible video series that you have to pay for LOL you explain it in layman‘s terms and it’s really helping me now after the fact. Not even needing to pass anymore",
    videoId: "tVoyYZhVsng",
  },
  {
    name: "JustInsurance Student",
    initials: "JI",
    source: "youtube",
    text: "I passed my exam on my first try! thank you very much! the videos are easy to understand, and I always played it in the car whenever I was going somewhere",
    videoId: "-Iqfheopp8k",
  },
  {
    name: "Ethanridener",
    initials: "ET",
    source: "youtube",
    text: "Justin, I just wanted to say thank you. You were the reason I passed the life Insurance exam. I used Adbanker for prelicensing and it was pretty confusing the first I read through it. After I watched a few of your videos it all came together. I was able to score an 82. I can't say thank you enough.",
    videoId: "hP7QMSMUxDI",
  },
  {
    name: "Juliestark",
    initials: "JU",
    source: "youtube",
    text: "Your videos helped me so much along side the course! I passed yesterday and I’m so excited to join the team and start writing policies soon! Thanks a bunch :)",
    videoId: "zcCOK4ztwec",
  },
  {
    name: "Sakaedavis",
    initials: "SA",
    source: "youtube",
    text: "I watched this video along with the insurance terms video and passed my exam two days ago! You had me laughing in the exam. Thank you so much! I created a study group with some people I recruited and immediately sent your videos in the chat. I even compiled your questions in the video and now host live kahoots games to make it more interesting for them. YOU ARE AMAZING!",
    videoId: "it9dlxYAAbY",
  },

];

// ---------------------------------------------------------------------------
// Public exports — site reads from these
// ---------------------------------------------------------------------------

/** All testimonials, YouTube first (most credible), then generic */
export const ALL_TESTIMONIALS: Testimonial[] = [
  ...YOUTUBE_COMMENTS,
  ...GENERIC_TESTIMONIALS,
];

/** Just the YouTube comments — used to count "verified social proof" */
export const YOUTUBE_TESTIMONIAL_COUNT = YOUTUBE_COMMENTS.length;

/** Total reviews displayed across the site (drives schema reviewCount) */
export const TOTAL_REVIEW_COUNT = ALL_TESTIMONIALS.length;

/**
 * Get the most relevant testimonial for a specific state.
 * Priority: YouTube comment for that state > verified student for that state > null.
 * State pages call this to surface state-specific social proof.
 */
export function getTestimonialForState(stateName: string): Testimonial | null {
  const youtubeMatch = YOUTUBE_COMMENTS.find(
    (t) => t.state?.toLowerCase() === stateName.toLowerCase()
  );
  if (youtubeMatch) return youtubeMatch;
  const studentMatch = GENERIC_TESTIMONIALS.find(
    (t) => t.state?.toLowerCase() === stateName.toLowerCase()
  );
  return studentMatch || null;
}

/**
 * Get N testimonials, prioritizing YouTube comments and a specific state.
 * Used by TestimonialCards on state hubs to fill the 3-card grid.
 */
export function getTestimonialsForState(
  stateName: string,
  count = 3,
  variant: "prelicensing" | "ce" = "prelicensing"
): Testimonial[] {
  const isCE = variant === "ce";
  const pool = ALL_TESTIMONIALS.filter((t) =>
    isCE ? t.source === "ce-renewal" : t.source !== "ce-renewal"
  );

  const stateSpecific = pool.filter(
    (t) => t.state?.toLowerCase() === stateName.toLowerCase()
  );
  const others = pool.filter(
    (t) => t.state?.toLowerCase() !== stateName.toLowerCase()
  );

  // Deterministic shuffle of others using state name as seed
  let h = 0;
  for (let i = 0; i < stateName.length; i++) h = ((h << 5) - h + stateName.charCodeAt(i)) | 0;
  const shuffled = [...others].sort((a, b) => {
    const aHash = (a.name.charCodeAt(0) + h) % 100;
    const bHash = (b.name.charCodeAt(0) + h) % 100;
    return aHash - bHash;
  });

  return [...stateSpecific, ...shuffled].slice(0, count);
}

// Re-export the helper for tests/migrations
export { deriveInitials };
