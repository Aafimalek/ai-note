import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from '@/helpers/responseHelper';

// POST - Create a new contact form submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return errorResponse('All fields are required', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('Invalid email format', 400);
    }

    // Connect to database
    await connectDB();

    // Create contact submission
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
    });

    await contact.save();

    const contactData = {
      id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      status: contact.status,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };

    return successResponse(contactData, 'Contact form submitted successfully');
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return serverErrorResponse(error);
  }
}

// GET - Get all contact submissions (for admin use - you may want to add authentication)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Contact.countDocuments(query);

    const contactsData = contacts.map((contact) => ({
      id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      status: contact.status,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }));

    return successResponse({
      contacts: contactsData,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return serverErrorResponse(error);
  }
}

