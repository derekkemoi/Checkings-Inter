import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, Zap, Lock, CheckCircle, FileText, Clock, TrendingUp, UserCheck, Search, FileCheck, Lightbulb, Star } from 'lucide-react';
import { BASE_PRICE_USD } from '@/lib/constants';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-6" variant="secondary">
                Trusted by 50,000+ Customers Worldwide
              </Badge>

              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6 px-4">
                Get Your{' '}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Credit Bureau Report
                </span>{' '}
                in Minutes
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
                Instant access to your credit report for employment, loan applications,
                and personal credit checks. Secure, fast, and reliable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/register">
                    Get Your Report Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground px-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-500" />
                  <span>Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>100% Confidential</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 sm:py-20 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-4">Why Choose Our Service?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">
                The fastest and most reliable way to access your credit bureau report worldwide
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Instant Access</CardTitle>
                  <CardDescription>
                    Get your CRB report in minutes, not days. No waiting, no paperwork.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your data is encrypted and protected with bank-level security measures.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Detailed Reports</CardTitle>
                  <CardDescription>
                    Comprehensive credit history including all your accounts and inquiries.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>24/7 Availability</CardTitle>
                  <CardDescription>
                    Access your report anytime, anywhere from any device.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Credit Score</CardTitle>
                  <CardDescription>
                    View your credit score and understand what affects it.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Verified & Trusted</CardTitle>
                  <CardDescription>
                    Officially recognized reports accepted by banks and employers.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="mb-4" variant="outline">
                Simple Process
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-4">
                Get Your Credit Report in 4 Simple Steps
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">
                The entire process takes less than 2 minutes. Fast, secure, and completely digital.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid gap-8 md:gap-12">
                <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">01</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <UserCheck className="h-6 w-6 text-primary" />
                      <h3 className="text-xl sm:text-2xl font-bold">Verify Your Identity</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Provide your national ID and personal information for secure verification. All data is encrypted using bank-level security protocols to protect your privacy.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">02</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Search className="h-6 w-6 text-primary" />
                      <h3 className="text-xl sm:text-2xl font-bold">Search Credit Database</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Our system instantly searches all major Credit Reference Bureaus in your country to compile your complete credit information and history across multiple sources.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">03</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <FileCheck className="h-6 w-6 text-primary" />
                      <h3 className="text-xl sm:text-2xl font-bold">Generate Your Report</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Receive a comprehensive report with your credit score, complete payment history, active loans, and detailed credit analysis within minutes of payment confirmation.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">04</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Lightbulb className="h-6 w-6 text-primary" />
                      <h3 className="text-xl sm:text-2xl font-bold">Understand Your Credit</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Get clear insights into your credit standing with easy-to-understand explanations of what affects your score and actionable steps to maintain or improve your creditworthiness.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Start Your Application Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="py-16 sm:py-20 lg:py-24 bg-muted/50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
            <div className="text-center">
              <Badge className="mb-4" variant="outline">
                Customer Reviews
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-4">
                Trusted by Customers Worldwide
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">
                See what our customers from around the globe say about their experience
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-4 animate-scroll">
              {[...Array(2)].flatMap(() => [
                { name: "James Wilson", country: "USA", rating: 5, review: "Received my report in under 3 minutes! Very fast and professional service. Highly recommend for anyone applying for a loan." },
                { name: "Sarah Johnson", country: "UK", rating: 5, review: "The process was straightforward and the report was detailed. Helped me understand my credit standing better." },
                { name: "Michael Chen", country: "Singapore", rating: 5, review: "Excellent service! Got my report instantly. The customer support team was very helpful." },
                { name: "Emma Thompson", country: "Canada", rating: 4, review: "Quick and reliable. Used it for my job application and it was accepted everywhere I submitted it." },
                { name: "Hans Mueller", country: "Germany", rating: 5, review: "Outstanding service! Clean interface, fast delivery, and very affordable pricing." },
                { name: "Priya Sharma", country: "India", rating: 5, review: "I was skeptical at first but the service exceeded my expectations. Very secure and professional." },
                { name: "David Martinez", country: "Mexico", rating: 5, review: "Got my report within 2 minutes of payment. The detailed breakdown helped me improve my score." },
                { name: "Sophie Anderson", country: "Australia", rating: 4, review: "Easy to use platform. The report format is clear and accepted by all financial institutions." },
                { name: "Ahmed Hassan", country: "UAE", rating: 5, review: "Impressed by the speed and accuracy. Will definitely use again when I need to update my report." },
                { name: "Lucas Silva", country: "Brazil", rating: 5, review: "The entire process was seamless. From registration to receiving the report, everything worked perfectly." },
                { name: "Park Ji-woo", country: "South Korea", rating: 5, review: "Very transparent pricing with no hidden fees. The report was comprehensive and easy to understand." },
                { name: "Emily Roberts", country: "USA", rating: 4, review: "Great service for checking credit status. Helped me identify and resolve issues with my credit record." },
                { name: "Oliver Brown", country: "UK", rating: 5, review: "Fastest report I've ever gotten. Customer service responded to my questions immediately." },
                { name: "Fatima Al-Rashid", country: "UAE", rating: 5, review: "Highly recommended! The security measures gave me confidence to share my personal information." },
                { name: "William Davis", country: "Canada", rating: 5, review: "Used it for my mortgage application. The bank accepted it without any questions. Professional service!" },
                { name: "Thandiwe Nkosi", country: "South Africa", rating: 4, review: "Simple and efficient. Got exactly what I needed for my tenant verification process." },
                { name: "Raj Patel", country: "India", rating: 5, review: "The report helped me understand why my loan application was rejected. Now working on improving my score." },
                { name: "Isabella Schmidt", country: "Germany", rating: 5, review: "Excellent experience from start to finish. The platform is user-friendly and secure." },
                { name: "Robert Taylor", country: "Australia", rating: 5, review: "Got my report at 11 PM! 24/7 service is a game changer. Very convenient and reliable." },
                { name: "Maria Gonzalez", country: "Mexico", rating: 4, review: "Good value for money. The report contained all the information I needed for my credit check." },
                { name: "Thomas White", country: "USA", rating: 5, review: "Professional and trustworthy service. The report was comprehensive and delivered instantly." },
                { name: "Amara Okafor", country: "South Africa", rating: 5, review: "Best decision I made! Knowing my credit score helped me negotiate better loan terms." },
                { name: "Daniel Lee", country: "Singapore", rating: 5, review: "Quick, secure, and affordable. Everything you need in a credit report service. Highly satisfied!" },
                { name: "Charlotte Moore", country: "UK", rating: 4, review: "The detailed credit analysis was very helpful. Now I understand what affects my credit score." },
                { name: "Carlos Fernandez", country: "Brazil", rating: 5, review: "Used it for employment verification. The employer was impressed with how quickly I provided it." },
                { name: "Yuki Tanaka", country: "South Korea", rating: 5, review: "Top-notch service! The report format is professional and accepted by all institutions." },
                { name: "Benjamin Clark", country: "Canada", rating: 5, review: "Fast, reliable, and secure. Got my report in minutes. Will recommend to friends and family." },
                { name: "Aisha Mohammed", country: "UAE", rating: 4, review: "Great platform for checking your credit status. The insights provided were very valuable." },
                { name: "James Kamau", country: "Kenya", rating: 5, review: "Seamless experience! From payment to report delivery, everything was smooth and professional." },
                { name: "Anjali Mehta", country: "India", rating: 5, review: "Absolutely fantastic service! Helped me clean up my credit record by identifying errors. Thank you!" },
              ]).map((review, index) => (
                <Card key={index} className="shrink-0 w-[350px] sm:w-[400px]">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{review.name}</CardTitle>
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{review.review}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="mb-4" variant="outline">
                FAQ
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">
                Everything you need to know about our credit report service
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a credit report and why do I need it?</AccordionTrigger>
                  <AccordionContent>
                    A credit report is a detailed document that shows your credit history, including loans, credit cards, payment behavior, and credit score. You need it for loan applications, employment verification, tenant screening, and understanding your financial standing.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How long does it take to get my report?</AccordionTrigger>
                  <AccordionContent>
                    Your credit report is generated instantly after payment confirmation. Most customers receive their reports within 2-3 minutes. The report is delivered directly to your email and available in your dashboard.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Is my personal information secure?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely. We use bank-level 256-bit SSL encryption to protect your data. Your information is never shared with third parties without your consent, and all transactions are processed through secure payment gateways.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept major credit cards, debit cards, and local payment methods through our secure payment gateway. All payment methods are processed instantly, allowing you to get your report immediately.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Is the report accepted by banks and employers?</AccordionTrigger>
                  <AccordionContent>
                    Yes, our reports are sourced directly from licensed Credit Reference Bureaus in your country and are widely accepted by banks, financial institutions, employers, and landlords globally.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Can I download and print my report?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can download your report as a PDF file and print it as many times as needed. The report remains accessible in your dashboard for future reference.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>What if I find errors in my report?</AccordionTrigger>
                  <AccordionContent>
                    If you identify any errors or discrepancies, you should contact the specific Credit Reference Bureau directly to dispute the information. We provide contact details for all CRBs in your report for easy follow-up.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>How often should I check my credit report?</AccordionTrigger>
                  <AccordionContent>
                    It's recommended to check your credit report at least once every 6 months to monitor your credit health, identify potential fraud, and address any issues before applying for credit.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>What information is included in the report?</AccordionTrigger>
                  <AccordionContent>
                    Your report includes your credit score, personal details, credit accounts (loans, credit cards), payment history, credit inquiries, public records, and a summary of your overall credit standing.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>Do I need an ID to get my report?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you need a valid national ID or passport number for identity verification. This is a regulatory requirement to ensure that credit information is only released to the rightful owner.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11">
                  <AccordionTrigger>What is a good credit score?</AccordionTrigger>
                  <AccordionContent>
                    Credit scores typically range from 300 to 850 in most countries. Generally, a score of 700+ is considered good to excellent, 650-699 is fair, and below 650 may need improvement. Your report includes a detailed breakdown of factors affecting your score specific to your region.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-12">
                  <AccordionTrigger>Can someone else request my report?</AccordionTrigger>
                  <AccordionContent>
                    No. Only you can request your own report. We require identity verification to ensure that credit information is only shared with the individual it belongs to, maintaining strict privacy and security.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-13">
                  <AccordionTrigger>How do I improve my credit score?</AccordionTrigger>
                  <AccordionContent>
                    Pay all bills on time, reduce your debt-to-income ratio, avoid multiple loan applications, correct any errors on your report, and maintain older credit accounts. Your report includes personalized recommendations.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-14">
                  <AccordionTrigger>What if I've never had a loan or credit card?</AccordionTrigger>
                  <AccordionContent>
                    If you have no credit history, your report will show limited information. However, you can still get a report confirming you have a clean record, which is useful for employment or rental applications.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-15">
                  <AccordionTrigger>Is there a refund policy?</AccordionTrigger>
                  <AccordionContent>
                    Due to the instant nature of our service, we do not offer refunds once the report has been generated and delivered. However, if you experience technical issues preventing report delivery, please contact support immediately.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-16">
                  <AccordionTrigger>Can I get reports for multiple people?</AccordionTrigger>
                  <AccordionContent>
                    Each report requires individual verification and payment. You cannot request reports for other people as this violates privacy regulations. Each person must request their own report using their ID.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-17">
                  <AccordionTrigger>How long is the report valid?</AccordionTrigger>
                  <AccordionContent>
                    Credit reports are typically valid for 30-90 days, depending on the requesting institution's requirements. Banks and employers usually accept reports issued within the last 30 days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-18">
                  <AccordionTrigger>What if my payment fails?</AccordionTrigger>
                  <AccordionContent>
                    If your payment fails, you can retry the payment process. Common reasons include insufficient funds, incorrect payment details, or network issues. Contact your payment provider or our support team if the problem persists.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-19">
                  <AccordionTrigger>Do you offer customer support?</AccordionTrigger>
                  <AccordionContent>
                    Yes, our customer support team is available via email and phone during business hours (8 AM - 8 PM, Monday to Saturday). We respond to all inquiries within 2 hours during business hours.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-20">
                  <AccordionTrigger>Can I access my report on mobile?</AccordionTrigger>
                  <AccordionContent>
                    Yes, our platform is fully mobile-responsive. You can register, pay, and access your report from any smartphone, tablet, or computer. The report is optimized for viewing on all screen sizes.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">
                One-time payment for instant access to your complete credit report
              </p>
            </div>

            <div className="max-w-md mx-auto px-4">
              <Card className="border-2 border-primary">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">Credit Report</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">${BASE_PRICE_USD}</span>
                  </div>
                  <CardDescription className="mt-2">
                    One-time payment, instant delivery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      'Full credit history',
                      'Current credit score',
                      'All account details',
                      'Credit inquiries',
                      'Payment history',
                      'Instant digital delivery',
                      'Valid for official use',
                      '24/7 access',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" size="lg" asChild>
                    <Link href="/register">
                      Get Your Report Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
