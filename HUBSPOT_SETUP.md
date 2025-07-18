# HubSpot CRM Integration Setup

This guide explains how to set up the HubSpot CRM integration for the contact forms.

## Prerequisites

1. A HubSpot account with API access
2. HubSpot API access token

## Setup Instructions

### 1. Get HubSpot Access Token

1. Log in to your HubSpot account
2. Go to Settings → Account Setup → Integrations → API Keys
3. Create a new private app or use an existing one
4. Copy the access token

### 2. Environment Variables

Create a `.env.local` file in your project root and add:

```env
# HubSpot Configuration
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here

# MongoDB Configuration (if not already set)
MONGODB_URI=your_mongodb_connection_string_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. How It Works

#### First Submission
- Creates a new contact in HubSpot with standard properties
- Maps form fields to HubSpot contact properties

#### Subsequent Submissions
- Updates existing contact information
- Overwrites previous data with new information

### 4. Form Data Mapping

The integration automatically maps form fields to HubSpot properties:

- `email` → `email` (required)
- `firstname` → `firstname`
- `lastname` → `lastname`
- `phone` → `phone`
- `company` → `company`
- `message` → Logged to console (can be stored as custom property if needed)

### 5. Standard HubSpot Properties Used

The integration uses only standard HubSpot contact properties:
- `email` (required)
- `firstname`
- `lastname`
- `phone`
- `company`

No custom properties are required for basic functionality.

### 6. Optional: Custom Properties

If you want to track additional data, you can create these custom properties in HubSpot:

- `message` (Text) - To store the contact message
- `submission_count` (Number) - To track form submissions
- `contact_status` (Single Select) - To track contact status (new_lead, re-engaged, etc.)
- `last_submission_date` (Date) - To track when they last submitted
- `first_submission_date` (Date) - To track when they first submitted

#### How to Create Custom Properties in HubSpot:

1. Go to Settings → Properties
2. Click "Create property"
3. Select "Contact" as the object type
4. Choose the property type (Number, Date, Single Select, etc.)
5. Set the internal name (e.g., `submission_count`)
6. Set the display name (e.g., "Submission Count")
7. For Single Select properties, add the options (e.g., "new_lead", "re-engaged")

**Note**: The integration will work without these custom properties, but they won't be tracked. If the properties don't exist, HubSpot will ignore them without causing errors.

### 7. Testing

1. Start your development server
2. Fill out either contact form:
   - Main contact page (`/contact`)
   - Odoo page contact section
3. Check your HubSpot contacts to see the new/updated contact
4. Check the browser console for integration logs

### 8. Error Handling

- If HubSpot integration fails, the contact is still saved to MongoDB
- Check the server logs for detailed error messages
- The form submission won't fail if HubSpot is unavailable

## API Endpoints

- `POST /api/contact` - Submit contact form data
- `GET /api/contact` - Get all contact submissions (MongoDB only)

## Troubleshooting

1. **Invalid Access Token**: Check your HubSpot access token
2. **API Limits**: HubSpot has rate limits - check their documentation
3. **Network Issues**: Ensure your server can reach HubSpot's API
4. **Missing Email**: Email is required for HubSpot contact creation

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive data
- Consider using HubSpot's webhook verification for production 