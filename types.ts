
export type ScreenName =
  // --- SYSTEM & LOADING ---
  | 'loading'
  | 'intro'
  | 'BACK' // Special navigation command


  // --- AUTH & ONBOARDING (1-5) ---
  | 'auth_phone'
  | 'auth_otp'
  | 'login'
  | 'register'
  | 'auth_permissions'
  | 'auth_privacy'
  | 'offer_accept'
  | 'onboarding_bio'
  | 'onboarding_application'

  // --- HOME & DASHBOARD (6-10) ---
  | 'home'
  | 'notifications'
  | 'stories'
  | 'qr_pass'

  // --- CLUB INFO (11-15) ---
  | 'club_select'
  | 'club_details'
  | 'club_contacts'
  | 'club_team'
  | 'club_news'
  | 'news_detail'

  // --- FEEDBACK (16-18) ---
  | 'reviews_list'
  | 'review_create'
  | 'review_result'

  // --- BOOKING FLOW (19-28) ---
  | 'booking_schedule' // General schedule
  | 'booking_list'
  | 'booking_class_details' // Group class
  | 'booking_pt_details' // Personal training
  | 'booking_spa_details' // SPA service
  | 'booking_pt_calendar' // NEW: Separate PT calendar
  | 'booking_confirm'
  | 'booking_result'
  | 'booking_cancel'
  | 'booking_reschedule'
  | 'waitlist'
  | 'event_details'

  // --- MY ACTIVITY (29-32) ---
  | 'plan'
  | 'my_schedule'
  | 'my_schedule_history'
  | 'my_booking_details'
  | 'calendar_sync'
  | 'stats'

  // --- HEALTH & METRICS (33-35) ---
  | 'trackers'
  | 'contraindications'
  | 'measurements'

  // --- WALLET & FINANCE (36-45) ---
  | 'wallet'
  | 'tariff_details'
  | 'purchased_services'
  | 'service_catalog'
  | 'invoice'
  | 'payment_methods'
  | 'payment_card_add'
  | 'payment_sbp'
  | 'payment_process'
  | 'payment_result'
  | 'payment_failed'
  | 'freezing'
  | 'loyalty'

  // --- PROFILE & SETTINGS (46-52) ---
  | 'profile'
  | 'profile_edit'
  | 'settings'
  | 'change_password' // NEW
  | 'about'
  | 'notification_settings'
  | 'family'
  | 'trainer_about'
  | 'favorites'
  | 'privacy_settings' // NEW
  | 'docs'
  | 'document_view'
  | 'support'
  | 'guest_visit'
  | 'achievements'
  | 'complaint'

  // --- COMMUNICATION (53-54) ---
  | 'chat_list'
  | 'chat_room'
  | 'community'
  | 'directory' // NEW
  | 'social_profile'
  | 'request_create' // NEW

  // --- TRAINER APP SPECIFIC (55-84) ---
  | 'trainer_login'
  | 'trainer_otp' // NEW
  | 'trainer_select_club'
  | 'trainer_logout' // NEW
  | 'trainer_home'
  | 'trainer_scan'
  | 'trainer_schedule'
  | 'trainer_class_details'
  | 'trainer_clients_list'
  | 'trainer_client_profile'
  | 'trainer_client_plan'
  | 'trainer_profile' // Public profile view
  | 'trainer_profile_edit' // Trainer editing their own profile
  | 'trainer_settings' // Now acts as "More" menu
  | 'trainer_preferences' // NEW: Detailed Settings
  | 'trainer_support'
  | 'trainer_finance'
  | 'trainer_requests'
  | 'trainer_chats'
  | 'trainer_notifications'
  | 'trainer_shift_end' // NEW 65
  | 'trainer_client_progress' // NEW 66
  | 'trainer_team' // NEW 67
  | 'trainer_tasks' // NEW 68
  | 'trainer_kpi' // NEW 69
  | 'trainer_exercise_library' // NEW 70
  | 'trainer_lead_details' // NEW 71
  | 'trainer_replacement' // NEW 72
  | 'trainer_salary_detail' // NEW 73
  | 'trainer_equipment_report' // NEW 74
  | 'trainer_knowledge_base' // NEW 75
  | 'trainer_broadcast' // NEW 76
  | 'trainer_availability' // NEW 77
  | 'trainer_client_assessment' // NEW 78
  | 'trainer_vacation' // NEW 79
  | 'trainer_client_notes' // NEW 80
  | 'trainer_certification' // NEW 81
  | 'trainer_payroll_history' // NEW 82
  | 'trainer_community' // NEW 83
  | 'trainer_education' // NEW 84

  // --- METHODIST APP SPECIFIC (89-99) ---
  | 'methodist_login'
  | 'methodist_otp'
  | 'methodist_select_club'
  | 'methodist_logout'
  | 'methodist_home'
  | 'methodist_programs'
  | 'methodist_program_detail'
  | 'methodist_trainers'
  | 'methodist_trainer_profile'
  | 'methodist_analytics'
  | 'methodist_settings'

  // --- E-COMMERCE & CONTENT (85-88) ---
  | 'shop_product_details' // NEW 85
  | 'cart' // NEW 86
  | 'nutrition_plan' // NEW 87
  | 'online_player' // NEW 88
  | 'brain_blink_game' // New BrainBlink Game
  | 'workout_session'; // New Active Workout Screen

export interface Plan {
  id: string;
  title: string;
  goal: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  currentWeek: number;
  progressPercentage: number;
}

export enum ActivityStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  MISSED = 'missed',
  PENDING = 'pending',
  OVERDUE = 'overdue',
}

export interface Activity {
  id: string;
  type: 'workout' | 'pt' | 'checkpoint' | 'measurement';
  title: string;
  date: string;
  time?: string;
  status: ActivityStatus;
  description?: string;
}

export interface Metric {
  date: string;
  weight: number;
  waist?: number;
}

// --- HOME SCREEN TYPES ---

export interface HomeData {
  clubName: string;
  clubLocation: string;
  unreadNotifications: number;
  userAvatar: string;
  tariff: {
    isActive: boolean;
    name: string;
    expiryDate: string; // ISO or formatted
  } | null;
  wallet: {
    balance: number;
    currency: string;
    hasDebt: boolean;
  };
  bonuses: {
    amount: number;
  };
  services: {
    total: number;
    left: number;
    name: string;
  } | null;
  nextBooking: {
    id: string;
    title: string;
    subtitle: string;
    time: string; // "19:00"
    date: string; // "Сегодня"
    isConfirmed: boolean;
    trainerAvatar?: string;
  } | null;
  promos: Array<{
    id: number;
    type: 'news' | 'event' | 'promo';
    title: string;
    subtitle: string;
    imageUrl: string;
  }>;
  stories: Array<{
    id: number;
    title: string;
    imageUrl: string;
    isViewed: boolean;
  }>;
}
