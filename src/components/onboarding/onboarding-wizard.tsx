"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { inferPersonality } from "@/lib/recommendations";
import { getPreferences, savePreferences } from "@/lib/storage";
import {
  CATEGORY_META,
  PERSONALITY_META,
  type Availability,
  type BudgetPreference,
  type EventCategory,
  type GroupSizePreference,
  type PersonalityType,
  type VibePreference,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 11;
const ONBOARDING_QUESTIONS = 9;

const CITIES = [
  { city: "San Francisco", label: "San Francisco, USA", lat: 37.7749, lng: -122.4194 },
  { city: "New York", label: "New York, USA", lat: 40.7128, lng: -74.006 },
  { city: "Austin", label: "Austin, USA", lat: 30.2672, lng: -97.7431 },
  { city: "Berlin", label: "Berlin, Germany", lat: 52.52, lng: 13.405 },
  { city: "London", label: "London, UK", lat: 51.5074, lng: -0.1278 },
  { city: "Toronto", label: "Toronto, Canada", lat: 43.6532, lng: -79.3832 },
];

const SWIPE_CATEGORIES: EventCategory[] = [
  "professional",
  "learning",
  "social",
  "culture",
  "active",
  "food",
];

const AVAILABILITY_OPTIONS: { id: Availability; label: string; hint: string }[] = [
  { id: "weekday-mornings", label: "Weekday mornings", hint: "Before work energy" },
  { id: "weekday-evenings", label: "Weekday evenings", hint: "After 6pm" },
  { id: "weekends", label: "Weekends", hint: "Sat & Sun" },
  { id: "late-night", label: "Late night", hint: "After 10pm" },
];

const BUDGET_OPTIONS: { id: BudgetPreference; label: string }[] = [
  { id: "free", label: "Free only" },
  { id: "under-20", label: "Under $20" },
  { id: "under-50", label: "Under $50" },
  { id: "any", label: "Any price" },
];

const QUIZ_QUESTIONS = [
  {
    question: "Your ideal Saturday looks like…",
    options: [
      { label: "Shipping a side project at a hackathon", value: "knowledge-hunter" },
      { label: "Demo day + founder networking", value: "network-builder" },
      { label: "Open-source sprint with the community", value: "adventure-seeker" },
      { label: "Engineering meetup then afterparty", value: "social-butterfly" },
    ],
  },
  {
    question: "You'd skip dinner to attend…",
    options: [
      { label: "A live LLM architecture talk", value: "knowledge-hunter" },
      { label: "YC office hours with alumni", value: "network-builder" },
      { label: "A hands-on Rust workshop", value: "adventure-seeker" },
      { label: "A product launch party", value: "social-butterfly" },
    ],
  },
  {
    question: "You feel most alive when…",
    options: [
      { label: "Your PR merges and CI goes green", value: "knowledge-hunter" },
      { label: "You're pitching on a hackathon stage", value: "network-builder" },
      { label: "You finally fix that gnarly bug", value: "adventure-seeker" },
      { label: "The room erupts after your demo", value: "social-butterfly" },
    ],
  },
];

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState<(typeof CITIES)[0] | null>(null);
  const [radiusKm, setRadiusKm] = useState(15);
  const [interests, setInterests] = useState<EventCategory[]>([]);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [budget, setBudget] = useState<BudgetPreference>("any");
  const [vibe, setVibe] = useState<VibePreference>("balanced");
  const [groupSize, setGroupSize] = useState<GroupSizePreference>("any");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [personality, setPersonality] = useState<PersonalityType | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.displayName && prefs.displayName !== "Roxy") {
      setDisplayName(prefs.displayName);
    }
  }, []);

  const finish = useCallback(
    (skipped = false) => {
      const resolvedPersonality =
        personality ?? inferPersonality(interests, vibe, quizAnswers);

      savePreferences({
        onboardingComplete: true,
        skippedOnboarding: skipped,
        displayName: displayName.trim() || "Roxy",
        location: location
          ? { lat: location.lat, lng: location.lng, city: location.city, label: location.label }
          : null,
        radiusKm,
        interests,
        availability,
        budget,
        vibe,
        groupSize,
        personality: resolvedPersonality,
        notificationsEnabled,
      });
      router.push("/discover");
    },
    [
      availability,
      budget,
      displayName,
      groupSize,
      interests,
      location,
      notificationsEnabled,
      personality,
      quizAnswers,
      radiusKm,
      router,
      vibe,
    ]
  );

  const handleSkip = () => finish(true);

  const detectLocation = () => {
    setLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't supported in this browser.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = CITIES.reduce((best, city) => {
          const d =
            (city.lat - pos.coords.latitude) ** 2 + (city.lng - pos.coords.longitude) ** 2;
          const bestD =
            (best.lat - pos.coords.latitude) ** 2 + (best.lng - pos.coords.longitude) ** 2;
          return d < bestD ? city : best;
        }, CITIES[0]);
        setLocation(nearest);
        setLocating(false);
      },
      () => {
        setLocationError("Couldn't access your location. Pick a city below.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const toggleInterest = (cat: EventCategory) => {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSwipe = (liked: boolean) => {
    const cat = SWIPE_CATEGORIES[swipeIndex];
    if (liked && !interests.includes(cat)) {
      setInterests((prev) => [...prev, cat]);
    } else if (!liked && interests.includes(cat)) {
      setInterests((prev) => prev.filter((c) => c !== cat));
    }
    if (swipeIndex < SWIPE_CATEGORIES.length - 1) {
      setSwipeIndex((i) => i + 1);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleQuizAnswer = (value: string) => {
    const next = [...quizAnswers, value];
    setQuizAnswers(next);
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((i) => i + 1);
    } else {
      const result = inferPersonality(interests, vibe, next);
      setPersonality(result);
      setStep((s) => s + 1);
    }
  };

  const stepTitles = [
    undefined,
    "Your name",
    "Location",
    "Distance",
    "Interests",
    "Schedule",
    "Budget",
    "Vibe",
    "Personality",
    "Notifications",
    undefined,
  ];

  const canContinue = () => {
    switch (step) {
      case 1:
        return displayName.trim().length > 0;
      case 2:
        return !!location;
      case 4:
        return swipeIndex >= SWIPE_CATEGORIES.length - 1 || interests.length > 0;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (step === 4 && swipeIndex < SWIPE_CATEGORIES.length - 1) return;
    if (step === 7 && quizIndex < QUIZ_QUESTIONS.length - 1) return;
    if (step === 7 && quizAnswers.length < QUIZ_QUESTIONS.length) return;
    if (step === TOTAL_STEPS - 1) {
      finish(false);
      return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="font-heading text-4xl leading-tight tracking-tight">
              Find your next <span className="text-rainbow">hackathon</span> or dev event
            </h1>
            <p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
              Gather learns what you build with and care about — then surfaces
              hackathons, meetups, and workshops worth your limited free time.
            </p>
            <div className="mt-10 grid w-full gap-3 text-left">
              {[
                "Hackathons, demo days, and engineer meetups",
                "See when your team is already going",
                "Save, share, and sync to your calendar",
              ].map((item) => (
                <div
                  key={item}
                  className="glass-card flex items-center gap-3 px-4 py-3"
                >
                  <div className="size-1.5 rounded-full dot-rainbow" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <p className="mb-2 text-sm font-medium text-rainbow">
              Step 1 of {ONBOARDING_QUESTIONS}
            </p>
            <h2 className="font-heading text-3xl tracking-tight">What should we call you?</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We&apos;ll personalize your daily event match — like &ldquo;Today&apos;s match
              for you.&rdquo;
            </p>
            <div className="mt-8">
              <Label htmlFor="displayName" className="sr-only">
                Your name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Roxy"
                autoComplete="given-name"
                autoFocus
                className="h-14 text-center text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && displayName.trim()) goNext();
                }}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <p className="mb-2 text-sm font-medium text-rainbow">Step 2 of {ONBOARDING_QUESTIONS}</p>
            <h2 className="font-heading text-3xl tracking-tight">
              Where should we look for events?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We&apos;ll show you what&apos;s happening nearby. You can change this anytime.
            </p>

            <Button
              variant="glass"
              className="mt-8 h-14 w-full justify-start gap-3 rounded-2xl border-dashed"
              onClick={detectLocation}
              disabled={locating}
            >
              {locating ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <MapPin className="size-5 text-rainbow" />
              )}
              <div className="text-left">
                <div className="font-medium">Use my current location</div>
                <div className="text-xs text-muted-foreground">Recommended</div>
              </div>
            </Button>

            {locationError && (
              <p className="mt-2 text-sm text-destructive">{locationError}</p>
            )}

            <p className="mb-3 mt-8 text-sm text-muted-foreground">Or choose a city</p>
            <div className="grid gap-2">
              {CITIES.map((city) => (
                <button
                  key={city.city}
                  type="button"
                  onClick={() => setLocation(city)}
                  className={cn(
                    "glass-card flex items-center gap-3 px-4 py-3 text-left transition-all",
                    location?.city === city.city
                      ? "glass-selected border-rainbow"
                      : "hover:bg-white/60"
                  )}
                >
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm font-medium">{city.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <p className="mb-2 text-sm font-medium text-rainbow">Step 3 of {ONBOARDING_QUESTIONS}</p>
            <h2 className="font-heading text-3xl tracking-tight">How far will you travel?</h2>
            <p className="mt-3 text-muted-foreground">
              {location
                ? `Showing events within ${radiusKm} km of ${location.city}.`
                : "Set your travel radius."}
            </p>
            <div className="glass-card-lg mt-12 p-8">
              <div className="mb-8 text-center">
                <span className="font-heading text-5xl tracking-tight">{radiusKm}</span>
                <span className="ml-1 text-xl text-muted-foreground">km</span>
              </div>
              <Slider
                value={[radiusKm]}
                onValueChange={([v]) => setRadiusKm(v)}
                min={2}
                max={50}
                step={1}
              />
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>Walking distance</span>
                <span>Worth the trip</span>
              </div>
            </div>
          </div>
        );

      case 4: {
        const cat = SWIPE_CATEGORIES[swipeIndex];
        const meta = CATEGORY_META[cat];
        return (
          <div>
            <p className="mb-2 text-sm font-medium text-rainbow">
              Step 4 of {ONBOARDING_QUESTIONS} · Swipe through
            </p>
            <h2 className="font-heading text-3xl tracking-tight">What catches your eye?</h2>
            <p className="mt-3 text-muted-foreground">
              Tap yes or no — we&apos;ll learn your taste fast.
            </p>

            <div className="relative mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cat}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="glass-card-lg overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${meta.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {swipeIndex + 1} / {SWIPE_CATEGORIES.length}
                    </Badge>
                    <h3 className="font-heading text-2xl">{meta.label}</h3>
                    <p className="mt-2 text-muted-foreground">{meta.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="glass"
                size="lg"
                className="h-14 rounded-full"
                onClick={() => handleSwipe(false)}
              >
                Not for me
              </Button>
              <Button
                size="lg"
                className="btn-rainbow h-14 rounded-full"
                onClick={() => handleSwipe(true)}
              >
                Love it
              </Button>
            </div>
          </div>
        );
      }

      case 5:
        return (
          <div>
            <p className="mb-2 text-sm font-medium text-rainbow">Step 5 of {ONBOARDING_QUESTIONS}</p>
            <h2 className="font-heading text-3xl tracking-tight">When are you usually free?</h2>
            <p className="mt-3 text-muted-foreground">Pick all that apply.</p>
            <div className="mt-8 grid gap-3">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    "glass-card flex cursor-pointer items-center gap-4 px-4 py-4 transition-all",
                    availability.includes(opt.id)
                      ? "glass-selected border-rainbow"
                      : "hover:bg-white/60"
                  )}
                >
                  <Checkbox
                    checked={availability.includes(opt.id)}
                    onCheckedChange={() =>
                      setAvailability((prev) =>
                        prev.includes(opt.id)
                          ? prev.filter((a) => a !== opt.id)
                          : [...prev, opt.id]
                      )
                    }
                  />
                  <div>
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.hint}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <p className="mb-2 text-sm font-medium text-rainbow">Step 6 of {ONBOARDING_QUESTIONS}</p>
            <h2 className="font-heading text-3xl tracking-tight">
              What&apos;s your budget comfort zone?
            </h2>
            <p className="mt-3 text-muted-foreground">No judgment — great events exist at every price.</p>
            <div className="mt-8 grid gap-3">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBudget(opt.id)}
                  className={cn(
                    "glass-card px-4 py-4 text-left text-sm font-medium transition-all",
                    budget === opt.id
                      ? "glass-selected border-rainbow"
                      : "hover:bg-white/60"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        if (quizIndex < QUIZ_QUESTIONS.length && quizAnswers.length <= quizIndex) {
          const q = QUIZ_QUESTIONS[quizIndex];
          return (
            <div>
              <p className="mb-2 text-sm font-medium text-rainbow">
                Step 7 of {ONBOARDING_QUESTIONS} · Quick quiz
              </p>
              <h2 className="font-heading text-3xl tracking-tight">{q.question}</h2>
              <p className="mt-3 text-muted-foreground">
                Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
              </p>
              <div className="mt-8 grid gap-3">
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleQuizAnswer(opt.value)}
                    className="glass-card px-4 py-4 text-left text-sm transition-all hover:glass-selected hover:border-rainbow"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return null;

      case 8: {
        const p =
          personality ?? inferPersonality(interests, vibe, quizAnswers);
        const meta = PERSONALITY_META[p];
        return (
          <div className="text-center">
            <p className="text-sm font-medium text-rainbow">Your event personality</p>
            <h2 className="mt-2 font-heading text-4xl tracking-tight text-rainbow">{meta.title}</h2>
            <p className="mx-auto mt-4 max-w-sm text-muted-foreground leading-relaxed">
              {meta.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {meta.traits.map((trait) => (
                <Badge key={trait} variant="secondary" className="px-3 py-1">
                  {trait}
                </Badge>
              ))}
            </div>

            <div className="glass-card-lg mt-10 p-6 text-left">
              <Label className="text-sm text-muted-foreground">Preferred crowd size</Label>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "solo", label: "Solo-friendly" },
                    { id: "small", label: "Small groups" },
                    { id: "any", label: "Any size" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGroupSize(opt.id)}
                    className={cn(
                      "rounded-full border px-2 py-2 text-xs font-medium transition-all",
                      groupSize === opt.id
                        ? "glass-selected border-rainbow"
                        : "glass-card border-transparent hover:bg-white/60"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <Label className="mt-6 block text-sm text-muted-foreground">Event vibe</Label>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "intimate", label: "Intimate" },
                    { id: "balanced", label: "Balanced" },
                    { id: "crowds", label: "Big crowds" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setVibe(opt.id)}
                    className={cn(
                      "rounded-full border px-2 py-2 text-xs font-medium transition-all",
                      vibe === opt.id
                        ? "glass-selected border-rainbow"
                        : "glass-card border-transparent hover:bg-white/60"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 9:
        return (
          <div>
            <p className="mb-2 text-sm font-medium text-rainbow">Almost done</p>
            <h2 className="font-heading text-3xl tracking-tight">Stay in the loop?</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Get notified when events match your taste — like &ldquo;3 culture events this
              weekend near you.&rdquo;
            </p>
            <div className="glass-card-lg mt-10 flex items-center justify-between p-6">
              <div>
                <div className="font-medium">Event notifications</div>
                <div className="text-sm text-muted-foreground">You can change this later</div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>
        );

      case 10:
        return (
          <div className="text-center">
            <h2 className="font-heading text-4xl tracking-tight">You&apos;re all set</h2>
            <p className="mx-auto mt-4 max-w-sm text-muted-foreground leading-relaxed">
              {displayName.trim()
                ? `You're set, ${displayName.trim()}.`
                : "You're all set."}{" "}
              {location
                ? `We've tuned Gather for ${location.city}.`
                : "Explore events picked just for you."}
            </p>
            {interests.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {interests.map((cat) => (
                  <Badge key={cat} variant="outline">
                    {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                  </Badge>
                ))}
              </div>
            )}
            <p className="mt-8 text-xs text-muted-foreground">
              No account needed yet — sign in with Supabase when you&apos;re ready.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const hideNav = step === 4 && swipeIndex < SWIPE_CATEGORIES.length;
  const hideNavQuiz = step === 7 && quizAnswers.length <= quizIndex;

  return (
    <OnboardingShell step={step} totalSteps={TOTAL_STEPS} title={stepTitles[step]} onSkip={handleSkip}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {!hideNav && !hideNavQuiz && (
        <div className="mt-10 flex items-center gap-3">
          {step > 0 && (
            <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <Button
            className="btn-rainbow h-12 flex-1 rounded-full"
            onClick={goNext}
            disabled={!canContinue()}
          >
            {step === TOTAL_STEPS - 1 ? "Start exploring" : "Continue"}
            {step < TOTAL_STEPS - 1 && <ArrowRight className="ml-2 size-4" />}
          </Button>
        </div>
      )}
    </OnboardingShell>
  );
}
