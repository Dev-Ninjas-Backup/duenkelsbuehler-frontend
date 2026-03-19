export interface BlogPost {
  id: string;
  title: string;
  date: string;
  image: string;
  content: string;
}

// In a real app this would come from an API/DB.
// Using a module-level array so admin changes reflect in the public page within the same session.
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Learn How to Trade Safely Online",
    date: "19 January 2025",
    image: "/images/blog/blog_post_1.png",
    content: `Trading online can be a rewarding experience when done safely. In this article, we cover the essential steps to protect yourself and your assets while engaging in digital transactions.

## Verify Your Counterparty

Always ensure you are transacting with **verified users**. Look for the AristoAccess+ badge which indicates a verified and trusted service provider.

## Use Secure Payment Methods

Never share sensitive personal information unless absolutely necessary, and always use the platform's built-in messaging and payment tools.

## Due Diligence

Remember: due diligence is your best protection. Research your counterparty, review their ratings, and don't hesitate to ask for references before committing to a transaction.`,
  },
  {
    id: "2",
    title: "Welcome to Our Knowledge Center",
    date: "19 January 2025",
    image: "/images/blog/blog_post_2.png",
    content: `Welcome to the **AristoPay Knowledge Center** — your go-to resource for everything related to our platform.

## Getting Started

Whether you're a service provider looking to grow your client base or a client seeking trusted professionals, this space is designed to help you get the most out of AristoPay.

## What You'll Find Here

Explore our guides on setting up your profile, understanding the verification process, and making the most of AristoAccess+. We regularly update this section with new articles, tips, and platform updates.

Have a question not covered here? Reach out to our support team anytime.`,
  },
  {
    id: "3",
    title: "Welcome to Our Knowledge Center",
    date: "19 January 2025",
    image: "/images/blog/blog_post_3.png",
    content: `This is the third blog post content. More details coming soon.`,
  },
];
