# MongoDB Setup Guide

This guide will help you set up MongoDB integration for the AI Notes application.

## Prerequisites

1. MongoDB Atlas account (free tier available) or local MongoDB instance
2. Clerk account with webhook secret configured

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notez?retryWrites=true&w=majority

# Clerk Webhook Secret (get from Clerk Dashboard > Webhooks)
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Getting MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Click "Connect" and copy the connection string
6. Replace `<password>` with your database user password

### Getting Clerk Webhook Secret

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to "Webhooks"
3. Create a new webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the "Signing Secret" (starts with `whsec_`)

## Project Structure

```
src/
├── models/           # MongoDB models
│   ├── User.ts      # User model
│   └── Note.ts      # Note model
├── controllers/      # Business logic
│   ├── userController.ts
│   └── noteController.ts
├── helpers/          # Utility functions
│   └── responseHelper.ts
├── lib/
│   ├── db.ts        # Database connection
│   └── api.ts       # API client
└── app/
    └── api/
        ├── webhooks/
        │   └── clerk/
        │       └── route.ts  # Clerk webhook handler
        └── notes/
            ├── route.ts      # GET, POST /api/notes
            └── [noteId]/
                ├── route.ts  # GET, PATCH, DELETE /api/notes/:id
                ├── pin/
                │   └── route.ts  # PATCH /api/notes/:id/pin
                └── tags/
                    └── route.ts  # POST, DELETE /api/notes/:id/tags
```

## Features

### User Management
- Automatic user creation when signing up via Clerk
- User data stored in MongoDB with Clerk ID as reference
- User updates and deletions synced via webhooks

### Note Management
- All notes stored in MongoDB with user ID association
- Notes are automatically filtered by authenticated user
- Full CRUD operations (Create, Read, Update, Delete)
- Additional features:
  - Pin/unpin notes
  - Add/remove tags
  - Encrypt/decrypt notes

## API Endpoints

### Notes
- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create a new note
- `GET /api/notes/[noteId]` - Get a specific note
- `PATCH /api/notes/[noteId]` - Update a note
- `DELETE /api/notes/[noteId]` - Delete a note
- `PATCH /api/notes/[noteId]/pin` - Toggle pin status
- `POST /api/notes/[noteId]/tags` - Add a tag
- `DELETE /api/notes/[noteId]/tags?tag=xxx` - Remove a tag

### Webhooks
- `POST /api/webhooks/clerk` - Clerk webhook handler (user events)

## Testing

1. Start your development server: `npm run dev`
2. Sign up a new user through Clerk
3. Check MongoDB to verify user was created
4. Create a note in the app
5. Check MongoDB to verify note was created with correct userId

## Troubleshooting

### Connection Issues
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### Webhook Issues
- Verify CLERK_WEBHOOK_SECRET is set correctly
- Check webhook endpoint URL in Clerk dashboard
- Ensure webhook events are selected (user.created, user.updated, user.deleted)

### Note Sync Issues
- Check browser console for API errors
- Verify user is authenticated (Clerk session)
- Check MongoDB connection logs

