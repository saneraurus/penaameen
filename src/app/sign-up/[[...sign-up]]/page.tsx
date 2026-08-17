import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] bg-background-50 flex items-center justify-center py-12 px-4">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-white",
            card: "rounded-3xl shadow-lg border border-supporting-200",
            headerTitle: "font-serif text-primary-950 font-bold",
            badge: { display: "none" },
          },
        }}
      />
    </div>
  );
}
