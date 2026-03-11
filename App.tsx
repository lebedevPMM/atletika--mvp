
import React, { useState, useEffect, useCallback } from 'react';
import { ScreenName } from './types';
import PlanScreen from './components/PlanScreen';
import HomeScreen from './components/HomeScreen';
import BookingScreen from './components/BookingScreen';
import ProfileScreen from './components/ProfileScreen';
import QRScreen from './components/QRScreen';
import WalletScreen from './components/WalletScreen';
import TariffScreen from './components/TariffScreen';
import NotificationsScreen from './components/NotificationsScreen';
import ClubInfoScreen from './components/ClubInfoScreen';
import DocumentsScreen from './components/DocumentsScreen';
import DocumentViewScreen from './components/DocumentViewScreen';
import SupportScreen from './components/SupportScreen';
import ChatListScreen from './components/ChatListScreen';
import ChatRoomScreen from './components/ChatRoomScreen';
import BookingDetailsScreen from './components/BookingDetailsScreen';
import BookingConfirmScreen from './components/BookingConfirmScreen';
import BookingCancelScreen from './components/BookingCancelScreen';
import AuthScreen from './components/AuthScreen';
import AuthPermissionsScreen from './components/AuthPermissionsScreen';
import OnboardingBioScreen from './components/OnboardingBioScreen';
import ClubSelectScreen from './components/ClubSelectScreen';
import NewsDetailScreen from './components/NewsDetailScreen';
import TrainerHomeScreen from './components/TrainerHomeScreen';
import TrainerClientsScreen from './components/TrainerClientsScreen';
import TrainerScheduleScreen from './components/TrainerScheduleScreen';
import TrainerClientProfileScreen from './components/TrainerClientProfileScreen';
import TrainerPlanScreen from './components/TrainerPlanScreen';
import MyScheduleScreen from './components/MyScheduleScreen';
import AddCardScreen from './components/AddCardScreen';
import FreezingScreen from './components/FreezingScreen';
import FamilyScreen from './components/FamilyScreen';
import LoyaltyScreen from './components/LoyaltyScreen';
import FavoritesScreen from './components/FavoritesScreen';
import SettingsScreen from './components/SettingsScreen';
import AboutScreen from './components/AboutScreen';
import ClubNewsScreen from './components/ClubNewsScreen';
import PurchasedServicesScreen from './components/PurchasedServicesScreen';
import ServiceCatalogScreen from './components/ServiceCatalogScreen';
import InvoiceScreen from './components/InvoiceScreen';
import WaitlistScreen from './components/WaitlistScreen';
import PaymentMethodsScreen from './components/PaymentMethodsScreen';
import PaymentProcessScreen from './components/PaymentProcessScreen';
import MeasurementsScreen from './components/MeasurementsScreen';
import TrainerProfileScreen from './components/TrainerProfileScreen';
import ReviewsListScreen from './components/ReviewsListScreen';
import ReviewCreateScreen from './components/ReviewCreateScreen';
import StoriesScreen from './components/StoriesScreen';
import ProfileEditScreen from './components/ProfileEditScreen';
import TrackersScreen from './components/TrackersScreen';
import ContraindicationsScreen from './components/ContraindicationsScreen';
import TrainerClassDetailsScreen from './components/TrainerClassDetailsScreen';
import PaymentSBPScreen from './components/PaymentSBPScreen';
import TrainerSettingsScreen from './components/TrainerSettingsScreen';
import EventDetailsScreen from './components/EventDetailsScreen';
import AuthPrivacyScreen from './components/AuthPrivacyScreen';
import ReviewResultScreen from './components/ReviewResultScreen';
import CalendarSyncScreen from './components/CalendarSyncScreen';
import TrainerLoginScreen from './components/TrainerLoginScreen';
import BookingSpaDetailsScreen from './components/BookingSpaDetailsScreen';
import MyBookingDetailsScreen from './components/MyBookingDetailsScreen';
import BookingPTScreen from './components/BookingPTScreen'; // NEW
import BookingResultScreen from './components/BookingResultScreen';
import PaymentResultScreen from './components/PaymentResultScreen';
import PaymentFailedScreen from './components/PaymentFailedScreen';
import NotificationSettingsScreen from './components/NotificationSettingsScreen';
import GuestVisitScreen from './components/GuestVisitScreen';
import AchievementsScreen from './components/AchievementsScreen';
import ComplaintScreen from './components/ComplaintScreen';
import LoadingScreen from './components/LoadingScreen';
import RescheduleScreen from './components/RescheduleScreen';
import OfferAcceptScreen from './components/OfferAcceptScreen';
import TrainerSelectClubScreen from './components/TrainerSelectClubScreen';
import TrainerDocsScreen from './components/TrainerDocsScreen';
import StatsScreen from './components/StatsScreen';
import TrainerSupportScreen from './components/TrainerSupportScreen';
import IntroScreen from './components/IntroScreen';
import TrainerScanScreen from './components/TrainerScanScreen';
import ChangePasswordScreen from './components/ChangePasswordScreen';
import TrainerFinanceScreen from './components/TrainerFinanceScreen';
import TrainerRequestsScreen from './components/TrainerRequestsScreen';
import TrainerProfileEditScreen from './components/TrainerProfileEditScreen';
import TrainerChatListScreen from './components/TrainerChatListScreen';
import TrainerNotificationsScreen from './components/TrainerNotificationsScreen';
import TrainerShiftEndScreen from './components/TrainerShiftEndScreen';
import TrainerClientProgressScreen from './components/TrainerClientProgressScreen';
import TrainerTeamScreen from './components/TrainerTeamScreen';
import TrainerTaskScreen from './components/TrainerTaskScreen';
import TrainerKPIScreen from './components/TrainerKPIScreen';
import TrainerExerciseLibraryScreen from './components/TrainerExerciseLibraryScreen';
import TrainerLeadDetailsScreen from './components/TrainerLeadDetailsScreen';
import TrainerReplacementScreen from './components/TrainerReplacementScreen';
import TrainerSalaryDetailScreen from './components/TrainerSalaryDetailScreen';
import TrainerEquipmentReportScreen from './components/TrainerEquipmentReportScreen';
import TrainerKnowledgeBaseScreen from './components/TrainerKnowledgeBaseScreen';
import TrainerBroadcastScreen from './components/TrainerBroadcastScreen';
import TrainerAvailabilityScreen from './components/TrainerAvailabilityScreen';
import TrainerClientAssessmentScreen from './components/TrainerClientAssessmentScreen';
import TrainerVacationScreen from './components/TrainerVacationScreen';
import TrainerClientNotesScreen from './components/TrainerClientNotesScreen';
import TrainerCertificationScreen from './components/TrainerCertificationScreen';
import TrainerPayrollHistoryScreen from './components/TrainerPayrollHistoryScreen';
import TrainerCommunityScreen from './components/TrainerCommunityScreen';
import TrainerEducationScreen from './components/TrainerEducationScreen';
import TrainerAboutScreen from './components/TrainerAboutScreen';
import TrainerLogoutScreen from './components/TrainerLogoutScreen';
import MethodistLoginScreen from './components/MethodistLoginScreen';
import MethodistOtpScreen from './components/MethodistOtpScreen';
import MethodistSelectClubScreen from './components/MethodistSelectClubScreen';
import MethodistLogoutScreen from './components/MethodistLogoutScreen';
import MethodistHomeScreen from './components/MethodistHomeScreen';
import MethodistProgramsScreen from './components/MethodistProgramsScreen';
import MethodistTrainersScreen from './components/MethodistTrainersScreen';
import MethodistSettingsScreen from './components/MethodistSettingsScreen';
import MethodistProgramDetailScreen from './components/MethodistProgramDetailScreen';
import MethodistTrainerProfileScreen from './components/MethodistTrainerProfileScreen';
import MethodistAnalyticsScreen from './components/MethodistAnalyticsScreen';
import TrainerOtpScreen from './components/TrainerOtpScreen'; // NEW
import TrainerPreferencesScreen from './components/TrainerPreferencesScreen'; // NEW
import ShopProductDetailsScreen from './components/ShopProductDetailsScreen';
import CartScreen from './components/CartScreen';
import NutritionPlanScreen from './components/NutritionPlanScreen';
import OnlineWorkoutPlayerScreen from './components/OnlineWorkoutPlayerScreen';
import BrainBlinkGameScreen from './components/BrainBlink/BrainBlinkGameScreen';
import WorkoutSessionScreen from './components/WorkoutSessionScreen';
import CommunityScreen from './components/CommunityScreen';
import DirectoryScreen from './components/DirectoryScreen';
import SocialProfileScreen from './components/social/SocialProfileScreen';
import RequestCreateScreen from './components/social/RequestCreateScreen';
import OnboardingApplicationScreen from './components/social/OnboardingApplicationScreen';
import PrivacyScreen from './components/PrivacyScreen';
import BottomNav from './components/BottomNav';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import { SocialProvider } from './components/social/SocialContext';
import { ArrowLeft, Construction } from 'lucide-react';

const App: React.FC = () => {
  // Start at Loading screen
  const [history, setHistory] = useState<ScreenName[]>(['loading']);
  const currentScreen = history[history.length - 1];

  const handleNavigate = (screen: ScreenName) => {
    console.log(`Navigating to: ${screen}`);

    if (screen === 'BACK') {
      if (history.length > 1) {
        setHistory(prev => prev.slice(0, -1));
      }
      return;
    }

    // Root Tabs - Reset Stack
    const rootTabs: ScreenName[] = [
      'home', 'plan', 'booking_schedule', 'chat_list', 'profile', // Client Tabs
      'trainer_home', 'trainer_schedule', 'trainer_clients_list', 'trainer_settings', // Trainer Tabs
      'methodist_home', 'methodist_programs', 'methodist_trainers', 'methodist_settings' // Methodist Tabs
    ];

    if (rootTabs.includes(screen)) {
      setHistory([screen]);
      window.history.replaceState({ screen }, '', '');
      return;
    }

    // Default: Push to stack
    setHistory(prev => [...prev, screen]);
    window.history.pushState({ screen }, '', '');
  };

  // Browser back button support
  useEffect(() => {
    const onPopState = () => {
      setHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Generic Placeholder for screens awaiting implementation
  const GenericScreen = ({ title, module }: { title: string, module: string }) => (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => handleNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h2 className="text-sm text-gray-500 font-medium uppercase tracking-wide">{module}</h2>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <Construction className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">В разработке</h3>
        <p className="text-gray-500 max-w-xs">
          Экран «{title}» описан в ТЗ, но макет еще не сверстан.
        </p>
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-600 break-all">
          ScreenID: {currentScreen}
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      // --- SYSTEM ---
      case 'loading': return <LoadingScreen onNavigate={handleNavigate} />;
      case 'intro': return <IntroScreen onNavigate={handleNavigate} />;

      // --- CORE IMPLEMENTED SCREENS ---
      case 'home': return <HomeScreen onNavigate={handleNavigate} />;
      case 'plan': return <PlanScreen onNavigate={handleNavigate} />;
      case 'booking_schedule':
      case 'booking_list':
        return <BookingScreen onNavigate={handleNavigate} />;
      case 'profile': return <ProfileScreen onNavigate={handleNavigate} />;
      case 'qr_pass': return <QRScreen onNavigate={handleNavigate} />;

      // --- FINANCE & UTILS ---
      case 'wallet': return <WalletScreen onNavigate={handleNavigate} />;
      case 'loyalty': return <LoyaltyScreen onNavigate={handleNavigate} />;
      case 'tariff_details': return <TariffScreen onNavigate={handleNavigate} />;
      case 'notifications': return <NotificationsScreen onNavigate={handleNavigate} />;
      case 'docs': return <DocumentsScreen onNavigate={handleNavigate} />;
      case 'document_view': return <DocumentViewScreen onNavigate={handleNavigate} />;
      case 'support': return <SupportScreen onNavigate={handleNavigate} />;
      case 'payment_card_add': return <AddCardScreen onNavigate={handleNavigate} />;
      case 'freezing': return <FreezingScreen onNavigate={handleNavigate} />;
      case 'purchased_services': return <PurchasedServicesScreen onNavigate={handleNavigate} />;
      case 'service_catalog': return <ServiceCatalogScreen onNavigate={handleNavigate} />;
      case 'invoice': return <InvoiceScreen onNavigate={handleNavigate} />;

      // --- COMMUNICATION & NETWORK ---
      case 'chat_list':
      case 'directory': return <DirectoryScreen onNavigate={handleNavigate} />;
      case 'community': return <CommunityScreen onNavigate={handleNavigate} />;
      case 'social_profile': return <SocialProfileScreen onNavigate={handleNavigate} userId="u2" />;
      case 'request_create': return <RequestCreateScreen onNavigate={handleNavigate} />;
      case 'chat_room': return <ChatRoomScreen onNavigate={handleNavigate} />;

      // --- CLUB INFO & REVIEWS ---
      case 'club_details': return <ClubInfoScreen onNavigate={handleNavigate} initialTab="info" />;
      case 'club_contacts': return <ClubInfoScreen onNavigate={handleNavigate} initialTab="contacts" />;
      case 'club_team': return <ClubInfoScreen onNavigate={handleNavigate} initialTab="team" />;
      case 'club_select': return <ClubSelectScreen onNavigate={handleNavigate} />;
      case 'club_news': return <ClubNewsScreen onNavigate={handleNavigate} />;
      case 'news_detail': return <NewsDetailScreen onNavigate={handleNavigate} />;
      case 'event_details': return <EventDetailsScreen onNavigate={handleNavigate} />;
      case 'stories': return <StoriesScreen onNavigate={handleNavigate} />;

      case 'trainer_profile': return <TrainerProfileScreen onNavigate={handleNavigate} />;
      case 'reviews_list': return <ReviewsListScreen onNavigate={handleNavigate} />;
      case 'review_create': return <ReviewCreateScreen onNavigate={handleNavigate} />;
      case 'review_result': return <ReviewResultScreen onNavigate={handleNavigate} />;

      // --- BOOKING DETAILS ---
      case 'booking_class_details': return <BookingDetailsScreen onNavigate={handleNavigate} type="group" />;
      case 'booking_pt_details': return <BookingDetailsScreen onNavigate={handleNavigate} type="pt" />;
      case 'booking_pt_calendar': return <BookingPTScreen onNavigate={handleNavigate} />; // NEW
      case 'booking_spa_details': return <BookingSpaDetailsScreen onNavigate={handleNavigate} />;
      case 'booking_confirm': return <BookingConfirmScreen onNavigate={handleNavigate} />;
      case 'booking_cancel': return <BookingCancelScreen onNavigate={handleNavigate} />;
      case 'booking_result': return <BookingResultScreen onNavigate={handleNavigate} />;
      case 'booking_reschedule': return <RescheduleScreen onNavigate={handleNavigate} />;
      case 'waitlist': return <WaitlistScreen onNavigate={handleNavigate} />;

      // --- AUTH FLOW ---
      case 'auth_phone': return <AuthScreen onNavigate={handleNavigate} initialStep="phone" mode="login" />; // Default to login
      case 'auth_otp': return <AuthScreen onNavigate={handleNavigate} initialStep="otp" mode="login" />;
      case 'login': return <AuthScreen onNavigate={handleNavigate} mode="login" />;
      case 'register': return <AuthScreen onNavigate={handleNavigate} mode="register" />;
      case 'auth_permissions': return <AuthPermissionsScreen onNavigate={handleNavigate} />;
      case 'auth_privacy': return <AuthPrivacyScreen onNavigate={handleNavigate} />;
      case 'offer_accept': return <OfferAcceptScreen onNavigate={handleNavigate} />;
      case 'onboarding_bio': return <OnboardingBioScreen onNavigate={handleNavigate} />;
      case 'onboarding_application': return <OnboardingApplicationScreen onNavigate={handleNavigate} />;


      // --- FINANCE (Remaining) ---
      case 'payment_methods': return <PaymentMethodsScreen onNavigate={handleNavigate} />;
      case 'payment_process': return <PaymentProcessScreen onNavigate={handleNavigate} />;
      case 'payment_sbp': return <PaymentSBPScreen onNavigate={handleNavigate} />;
      case 'payment_result': return <PaymentResultScreen onNavigate={handleNavigate} />;
      case 'payment_failed': return <PaymentFailedScreen onNavigate={handleNavigate} />;

      // --- PROFILE SUB-SCREENS ---
      case 'profile_edit': return <ProfileEditScreen onNavigate={handleNavigate} />;
      case 'family': return <FamilyScreen onNavigate={handleNavigate} />;
      case 'settings': return <SettingsScreen onNavigate={handleNavigate} />;
      case 'change_password': return <ChangePasswordScreen onNavigate={handleNavigate} />;
      case 'about': return <AboutScreen onNavigate={handleNavigate} />;
      case 'notification_settings': return <NotificationSettingsScreen onNavigate={handleNavigate} />;

      case 'privacy_settings': return <PrivacyScreen onNavigate={handleNavigate} />;
      case 'favorites': return <FavoritesScreen onNavigate={handleNavigate} />;
      case 'my_schedule': return <MyScheduleScreen onNavigate={handleNavigate} />;
      case 'trainer_about': return <TrainerAboutScreen onNavigate={handleNavigate} />;
      case 'my_booking_details': return <MyBookingDetailsScreen onNavigate={handleNavigate} />;
      case 'my_schedule_history': return <MyScheduleScreen onNavigate={handleNavigate} />;
      case 'calendar_sync': return <CalendarSyncScreen onNavigate={handleNavigate} />;
      case 'measurements': return <MeasurementsScreen onNavigate={handleNavigate} />;
      case 'trackers': return <TrackersScreen onNavigate={handleNavigate} />;
      case 'contraindications': return <ContraindicationsScreen onNavigate={handleNavigate} />;
      case 'guest_visit': return <GuestVisitScreen onNavigate={handleNavigate} />;
      case 'achievements': return <AchievementsScreen onNavigate={handleNavigate} />;
      case 'complaint': return <ComplaintScreen onNavigate={handleNavigate} />;
      case 'stats': return <StatsScreen onNavigate={handleNavigate} />;

      // --- TRAINER APP ---
      case 'trainer_login': return <TrainerLoginScreen onNavigate={handleNavigate} />;
      case 'trainer_otp': return <TrainerOtpScreen onNavigate={handleNavigate} />; // NEW
      case 'trainer_select_club': return <TrainerSelectClubScreen onNavigate={handleNavigate} />;
      case 'trainer_logout': return <TrainerLogoutScreen onNavigate={handleNavigate} />;
      case 'trainer_preferences': return <TrainerPreferencesScreen onNavigate={handleNavigate} />; // NEW
      case 'trainer_home': return <TrainerHomeScreen onNavigate={handleNavigate} />;
      case 'trainer_scan': return <TrainerScanScreen onNavigate={handleNavigate} />;
      case 'trainer_schedule': return <TrainerScheduleScreen onNavigate={handleNavigate} />;
      case 'trainer_clients_list': return <TrainerClientsScreen onNavigate={handleNavigate} />;
      case 'trainer_client_profile': return <TrainerClientProfileScreen onNavigate={handleNavigate} />;
      case 'trainer_client_plan': return <TrainerPlanScreen onNavigate={handleNavigate} />;
      case 'trainer_class_details': return <TrainerClassDetailsScreen onNavigate={handleNavigate} />;
      case 'trainer_settings': return <TrainerSettingsScreen onNavigate={handleNavigate} />;
      // case 'trainer_docs': return <TrainerDocsScreen onNavigate={handleNavigate} />;
      case 'trainer_support': return <TrainerSupportScreen onNavigate={handleNavigate} />;
      case 'trainer_finance': return <TrainerFinanceScreen onNavigate={handleNavigate} />;
      case 'trainer_requests': return <TrainerRequestsScreen onNavigate={handleNavigate} />;
      case 'trainer_profile_edit': return <TrainerProfileEditScreen onNavigate={handleNavigate} />;
      case 'trainer_chats': return <TrainerChatListScreen onNavigate={handleNavigate} />;
      case 'trainer_notifications': return <TrainerNotificationsScreen onNavigate={handleNavigate} />;
      case 'trainer_shift_end': return <TrainerShiftEndScreen onNavigate={handleNavigate} />;
      case 'trainer_client_progress': return <TrainerClientProgressScreen onNavigate={handleNavigate} />;
      case 'trainer_team': return <TrainerTeamScreen onNavigate={handleNavigate} />;
      case 'trainer_tasks': return <TrainerTaskScreen onNavigate={handleNavigate} />;
      case 'trainer_kpi': return <TrainerKPIScreen onNavigate={handleNavigate} />;
      case 'trainer_exercise_library': return <TrainerExerciseLibraryScreen onNavigate={handleNavigate} />;
      case 'trainer_lead_details': return <TrainerLeadDetailsScreen onNavigate={handleNavigate} />;
      case 'trainer_replacement': return <TrainerReplacementScreen onNavigate={handleNavigate} />;
      case 'trainer_salary_detail': return <TrainerSalaryDetailScreen onNavigate={handleNavigate} />;
      case 'trainer_equipment_report': return <TrainerEquipmentReportScreen onNavigate={handleNavigate} />;
      case 'trainer_knowledge_base': return <TrainerKnowledgeBaseScreen onNavigate={handleNavigate} />;
      case 'trainer_broadcast': return <TrainerBroadcastScreen onNavigate={handleNavigate} />;
      case 'trainer_availability': return <TrainerAvailabilityScreen onNavigate={handleNavigate} />;
      case 'trainer_client_assessment': return <TrainerClientAssessmentScreen onNavigate={handleNavigate} />;
      case 'trainer_vacation': return <TrainerVacationScreen onNavigate={handleNavigate} />;
      case 'trainer_client_notes': return <TrainerClientNotesScreen onNavigate={handleNavigate} />;
      case 'trainer_certification': return <TrainerCertificationScreen onNavigate={handleNavigate} />;
      case 'trainer_payroll_history': return <TrainerPayrollHistoryScreen onNavigate={handleNavigate} />;
      case 'trainer_community': return <TrainerCommunityScreen onNavigate={handleNavigate} />;
      case 'trainer_education': return <TrainerEducationScreen onNavigate={handleNavigate} />;

      // --- METHODIST APP ---
      case 'methodist_login': return <MethodistLoginScreen onNavigate={handleNavigate} />;
      case 'methodist_otp': return <MethodistOtpScreen onNavigate={handleNavigate} />;
      case 'methodist_select_club': return <MethodistSelectClubScreen onNavigate={handleNavigate} />;
      case 'methodist_logout': return <MethodistLogoutScreen onNavigate={handleNavigate} />;
      case 'methodist_home': return <MethodistHomeScreen onNavigate={handleNavigate} />;
      case 'methodist_programs': return <MethodistProgramsScreen onNavigate={handleNavigate} />;
      case 'methodist_program_detail': return <MethodistProgramDetailScreen onNavigate={handleNavigate} />;
      case 'methodist_trainers': return <MethodistTrainersScreen onNavigate={handleNavigate} />;
      case 'methodist_trainer_profile': return <MethodistTrainerProfileScreen onNavigate={handleNavigate} />;
      case 'methodist_analytics': return <MethodistAnalyticsScreen onNavigate={handleNavigate} />;
      case 'methodist_settings': return <MethodistSettingsScreen onNavigate={handleNavigate} />;

      // NEW CLIENT SCREENS
      case 'shop_product_details': return <ShopProductDetailsScreen onNavigate={handleNavigate} />;
      case 'cart': return <CartScreen onNavigate={handleNavigate} />;
      case 'nutrition_plan': return <NutritionPlanScreen onNavigate={handleNavigate} />;

      case 'online_player': return <OnlineWorkoutPlayerScreen onNavigate={handleNavigate} />;
      case 'brain_blink_game': return <BrainBlinkGameScreen onNavigate={handleNavigate} mode="casual" />;
      case 'workout_session': return <WorkoutSessionScreen onNavigate={handleNavigate} />;

      // --- DEFAULT / FALLBACK ---
      default: return <GenericScreen title="Детали" module="Общее" />;
    }
  };

  const isFullScreen =
    currentScreen === 'loading' ||
    currentScreen === 'intro' ||
    currentScreen === 'qr_pass' ||
    currentScreen === 'login' ||
    currentScreen === 'register' ||
    currentScreen.startsWith('auth_') ||
    currentScreen === 'offer_accept' ||
    currentScreen === 'club_select' ||
    currentScreen === 'onboarding_bio' ||
    // Trainer Screens that SHOULD be full screen (No Nav)
    currentScreen === 'trainer_login' ||
    currentScreen === 'trainer_otp' ||
    currentScreen === 'trainer_select_club' ||
    currentScreen === 'trainer_scan' ||
    // Methodist auth screens (no nav)
    currentScreen === 'methodist_login' ||
    currentScreen === 'methodist_otp' ||
    currentScreen === 'methodist_select_club' ||
    currentScreen === 'methodist_logout' ||
    // trainer_home, trainer_schedule, etc DO HAVE NAV now

    currentScreen === 'stories' ||
    currentScreen === 'review_result' ||
    currentScreen === 'booking_result' ||
    // Confirmation & checkout flows should hide nav
    currentScreen === 'booking_confirm' ||
    currentScreen === 'booking_cancel' ||
    currentScreen === 'booking_reschedule' ||
    currentScreen === 'booking_class_details' ||
    currentScreen === 'booking_pt_details' ||
    currentScreen === 'booking_spa_details' ||
    currentScreen === 'my_booking_details' ||
    // New additions for full screen mode
    currentScreen === 'social_profile' ||
    currentScreen === 'request_create' ||
    currentScreen === 'chat_room' ||
    currentScreen === 'complaint' ||
    currentScreen === 'change_password' ||
    currentScreen === 'onboarding_application' ||
    currentScreen === 'profile_edit' ||
    currentScreen === 'payment_methods' ||
    currentScreen === 'payment_sbp' ||
    currentScreen === 'payment_process' ||
    currentScreen === 'payment_result' ||
    currentScreen === 'payment_failed' ||
    currentScreen === 'online_player' ||
    currentScreen === 'review_create' ||
    currentScreen === 'payment_card_add' ||
    // Fixed Bottom Elements Screens (No Nav)
    currentScreen === 'shop_product_details' ||
    currentScreen === 'cart' ||
    currentScreen === 'trackers' ||
    currentScreen === 'trainer_exercise_library' ||
    currentScreen === 'news_detail' ||
    currentScreen === 'event_details' ||
    currentScreen === 'document_view' ||
    currentScreen === 'brain_blink_game' ||
    currentScreen === 'workout_session' ||
    currentScreen === 'nutrition_plan';

  return (
    <ThemeProvider>
      <SocialProvider>
        <AppContent
          currentScreen={currentScreen}
          renderScreen={renderScreen}
          handleNavigate={handleNavigate}
          isFullScreen={isFullScreen}
        />
      </SocialProvider>
    </ThemeProvider>
  );
};

const AppContent = ({ currentScreen, renderScreen, handleNavigate, isFullScreen }: any) => {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto overflow-hidden relative shadow-2xl bg-t-bg text-t-text ${theme === 'light' ? 'status-bar-light' : ''}`} style={{ fontFamily: 'var(--t-font-body)' }}>
      <ThemeSwitcher />
      <main className={`flex-1 overflow-y-auto no-scrollbar ${isFullScreen ? 'z-50' : ''}`}>
        {renderScreen()}
      </main>

      {!isFullScreen && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;
