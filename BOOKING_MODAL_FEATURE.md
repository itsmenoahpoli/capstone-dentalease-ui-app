# Appointment Booking Modal Feature

## Overview

A user-friendly appointment booking modal has been implemented for the patient dashboard. This feature allows users to easily book dental appointments with enhanced date and time pickers for better user experience.

## Features

### Enhanced User Experience

- **Visual Date Picker**: Modern date picker with min/max date constraints (tomorrow to 30 days from now)
- **Time Slot Selection**: Grid-based time picker with predefined available slots
- **Service Selection**: Dropdown with available dental services from the backend
- **Auto-fill User Data**: Automatically populates user information from stored auth data
- **Form Validation**: Comprehensive validation with real-time error messages
- **Success/Error Feedback**: Toast notifications for user feedback

### Technical Implementation

#### Components

- `UserAppointmentBookingModal.tsx`: Main booking modal component
- Integrated into `app/user/page.tsx` dashboard

#### Key Features

1. **Date Constraints**:

   - Minimum date: Tomorrow (prevents booking for today)
   - Maximum date: 30 days from now

2. **Time Slots**:

   - Morning: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30
   - Afternoon: 13:00, 13:30, 14:00, 14:30, 15:00, 15:30, 16:00, 16:30

3. **Service Integration**:

   - Fetches available services from `offeredServicesService`
   - Displays service name and price
   - Includes common dental services as fallback options

4. **User Data Auto-fill**:

   - Name and email from stored user session
   - Contact number requires manual input

5. **Form Validation**:
   - Required fields: name, email, contact, purpose, date, time
   - Email format validation
   - Real-time validation feedback

#### Styling

- Color-coded sections (blue for personal info, green for appointment details, purple for schedule)
- Responsive design with proper spacing
- Icon integration for better visual hierarchy
- Disabled state for submit button until all required fields are filled

## Usage

### For Users

1. Navigate to the Patient Dashboard (`/user`)
2. Click the "Book New" button in the "Recent Appointments" section
3. Fill in personal information (auto-filled if logged in)
4. Select a service/purpose from the dropdown
5. Choose preferred date (tomorrow onwards)
6. Select preferred time slot
7. Add optional remarks
8. Click "Book Appointment" to submit

### For Developers

```tsx
import { UserAppointmentBookingModal } from "@/components/modules/appointments";

// In your component
const [isModalOpen, setIsModalOpen] = useState(false);

<UserAppointmentBookingModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={() => {
    // Refresh appointments list
    loadAppointments();
  }}
/>;
```

## API Integration

- Uses `appointmentsService.createAppointment()` for booking
- Uses `offeredServicesService.getAll()` for service list
- Uses `authService.getStoredUser()` for user data

## Error Handling

- Network errors show toast notifications
- Form validation prevents invalid submissions
- Graceful fallback for service loading failures

## Future Enhancements

- Real-time availability checking
- Calendar view for date selection
- Recurring appointment options
- Payment integration
- SMS/Email confirmations
