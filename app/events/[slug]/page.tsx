import { redirect } from "next/navigation";

export default function EventSlugRedirect({ params }: { params: { slug: string } }) {
  const { slug } = params;
  redirect(`/event/${slug}`);
}
