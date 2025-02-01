import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "$10K+", label: "Monthly Revenue Increase" },
  { value: "90%", label: "Automated Inquiries" },
  { value: "24/7", label: "Availability" },
  { value: "10x", label: "Faster Response Time" },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-20 bg-gradient-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Transform Your Practice</h2>
          <p className="text-gray-100 max-w-2xl mx-auto">
            See the real impact our AI solutions can have on your healthcare practice
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white/10 border-none">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-gray-100">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;