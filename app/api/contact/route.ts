import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, role, businessIdea, timeline, phone } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to your database
    // 2. Send to your CRM (HubSpot, Salesforce, etc.)
    // 3. Send email notifications
    // 4. Add to email marketing list

    // For now, we'll just log the data and return success
    console.log('New lead captured:', {
      name,
      email,
      company,
      role,
      businessIdea,
      timeline,
      phone,
      timestamp: new Date().toISOString(),
      source: 'landing-page-form'
    });

    // You could integrate with services like:
    // - HubSpot API
    // - Mailchimp API
    // - Google Sheets API
    // - Airtable API
    // - Your own database

    // Example: Send to Google Sheets (you'd need to set this up)
    // await addToGoogleSheet({
    //   name,
    //   email,
    //   company,
    //   role,
    //   businessIdea,
    //   timeline,
    //   phone,
    //   date: new Date().toISOString()
    // });

    // Example: Send email notification
    // await sendEmailNotification({
    //   to: 'baheem@summonexperts.com',
    //   subject: 'New Early Access Request',
    //   body: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nRole: ${role}\nBusiness Idea: ${businessIdea}\nTimeline: ${timeline}\nPhone: ${phone}`
    // });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your interest! We\'ll contact you within 24 hours.',
        leadId: `lead_${Date.now()}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if the API is working
export async function GET() {
  return NextResponse.json(
    { 
      status: 'Contact API is running',
      endpoints: {
        POST: '/api/contact - Submit contact form'
      }
    },
    { status: 200 }
  );
} 