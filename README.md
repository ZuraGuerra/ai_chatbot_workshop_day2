# EBAC T3 Stack Chatbot Workshop - Day 2 Code

This is a [T3 Stack](https://create.t3.gg/) project demonstrating how to build an AI-powered chatbot integrated with [Plomb](https://plomb.ai). Built with TypeScript and modern web technologies.

## Prerequisites

- Node.js
- [Plomb](https://plomb.ai) account

## Getting Started

First, set up your development environment:

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up your database:
```bash
npx prisma db push
npx prisma generate
```

1. Configure environment variables:
```bash
PLOMB_WORKFLOW_URL=your_plomb_workflow_url
PLOMB_API_KEY=your_plomb_token
```

1. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Tech Stack

This project uses:

- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM
- [SQLite](https://www.sqlite.org) - Database
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [tRPC](https://trpc.io) - Type-safe APIs
- [Plomb](https://plomb.ai) - AI Integration

## Database Configuration

This project uses SQLite for simplicity. The database file is located at `prisma/db.sqlite`.

To modify your database schema:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Run `npx prisma generate`

## Plomb.ai Setup

1. Sign up at [Plomb.ai](https://plomb.ai)
2. Configure your workflow for chatbot functionality
3. Set up environment variables with your Plomb credentials

## Learn More

To understand the T3 Stack better:

- [T3 Stack Documentation](https://create.t3.gg/)
- [Plomb Website](https://plomb.ai)

## Important Notes

- This is a demo project for educational purposes
- You must have a compatible Plomb workflow before running the application

## Support

For questions about this demo, please open an issue.
