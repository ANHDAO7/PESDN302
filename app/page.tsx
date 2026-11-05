import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1
            data-testid="home-title"
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            ExpenseTrail
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Your personal expense tracker — log what you spend, categorize it,
            and see exactly where your money goes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">📝 Track spending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Quickly add your daily expenses with a title, amount, and date.
                Never lose track of a purchase again.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">
                🗂️ Sort into categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Organize your expenses into Food, Transport, Bills, Shopping, or
                Other — and filter by them instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">
                📊 See where it goes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Get a live summary of your spending by category — total amounts,
                counts, and starred highlights.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
