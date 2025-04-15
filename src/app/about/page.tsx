import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Code, PenSquare, Layers, Palette, Move, Share } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-8"> 
      <h1 className="text-2xl font-bold">Exacto</h1>
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Canvas
          </Button>
        </Link>
      </div>
      
      <Separator className="mb-10" />
      
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Pixel-Perfect Layout Design</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Exacto makes it simple to design and visualize layouts with precision. Build, experiment, and export your designs with ease.
        </p>
        <div className="relative h-80 w-full rounded-lg bg-muted mx-auto mb-8 flex items-center justify-center border">
          {/* Placeholder for hero screenshot */}
          <div className="text-muted-foreground">
            [Main Canvas Screenshot - showing the complete UI with canvas and toolbars]
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="mb-16">
        <h3 className="text-3xl font-bold mb-10 text-center">Core Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
          {/* Feature 1 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-6 w-6 text-primary" />
              <h4 className="text-2xl font-semibold">Intuitive Layout Building</h4>
            </div>
            <p className="text-muted-foreground mb-6">
              Drag, drop, and arrange elements with pixel-perfect precision. Create complex layouts with ease using our intuitive visual interface.
            </p>
            <div className="rounded-lg bg-muted h-60 w-full flex items-center justify-center border">
              {/* Placeholder for feature screenshot */}
              <div className="text-muted-foreground">
                [Screenshot of Canvas Tree View and element structure]
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Move className="h-6 w-6 text-primary" />
              <h4 className="text-2xl font-semibold">Absolute & Relative Positioning</h4>
            </div>
            <p className="text-muted-foreground mb-6">
              Switch seamlessly between absolute and relative positioning. Experiment with different layout approaches without writing a single line of code.
            </p>
            <div className="rounded-lg bg-muted h-60 w-full flex items-center justify-center border">
              {/* Placeholder for feature screenshot */}
              <div className="text-muted-foreground">
                [Screenshot of positioning controls and element properties]
              </div>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-6 w-6 text-primary" />
              <h4 className="text-2xl font-semibold">Style with Ease</h4>
            </div>
            <p className="text-muted-foreground mb-6">
              Customize colors, borders, dimensions, and more with our intuitive toolbar. See changes instantly as you make them.
            </p>
            <div className="rounded-lg bg-muted h-60 w-full flex items-center justify-center border">
              {/* Placeholder for feature screenshot */}
              <div className="text-muted-foreground">
                [Screenshot of styling tools and controls]
              </div>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <h4 className="text-2xl font-semibold">Export to Code</h4>
            </div>
            <p className="text-muted-foreground mb-6">
              Generate ready-to-use HTML and CSS code from your designs. Copy and paste directly into your projects without manual coding.
            </p>
            <div className="rounded-lg bg-muted h-60 w-full flex items-center justify-center border">
              {/* Placeholder for feature screenshot */}
              <div className="text-muted-foreground">
                [Screenshot of code generation interface]
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How to Use Section */}
      <section className="mb-16">
        <h3 className="text-3xl font-bold mb-10 text-center">How to Use Exacto</h3>
        
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h4 className="text-2xl font-semibold">Start with a Container</h4>
              </div>
              <p className="text-muted-foreground">
                Create your first container element using the toolbar. Set dimensions, background color, and border properties to get started.
              </p>
            </div>
            <div className="md:w-1/2 rounded-lg bg-muted h-60 w-full flex items-center justify-center border">
              {/* Placeholder for step screenshot */}
              <div className="text-muted-foreground">
                [Screenshot of adding a new container]
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 order-2 md:order-1 rounded-lg bg-muted h-60 w-full flex items-center justify-center border">
              {/* Placeholder for step screenshot */}
              <div className="text-muted-foreground">
                [Screenshot of adding child elements]
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h4 className="text-2xl font-semibold">Add Child Elements</h4>
              </div>
              <p className="text-muted-foreground">
                Nest elements inside your container to create complex layouts. Add, position, and resize each element with visual feedback.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h4 className="text-2xl font-semibold">Fine-tune with Controls</h4>
              </div>
              <p className="text-muted-foreground">
                Use the dimensional controls and z-index manager to precisely position your elements. Switch between absolute and relative positioning to create the perfect layout.
              </p>
            </div>
            <div className="md:w-1/2 rounded-lg bg-muted h-60 w-full flex items-center justify-center border">
              {/* Placeholder for step screenshot */}
              <div className="text-muted-foreground">
                [Screenshot of fine-tuning layout with controls]
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 order-2 md:order-1 rounded-lg bg-muted h-60 w-full flex items-center justify-center border">
              {/* Placeholder for step screenshot */}
              <div className="text-muted-foreground">
                [Screenshot of code export interface]
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  4
                </div>
                <h4 className="text-2xl font-semibold">Export Your Design</h4>
              </div>
              <p className="text-muted-foreground">
                Once your layout is perfect, generate the HTML and CSS code with a single click. Copy the code directly to your clipboard, ready to use in your projects.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="text-center bg-muted p-10 rounded-lg">
        <h3 className="text-3xl font-bold mb-4">Ready to Create?</h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          Start building beautiful, precise layouts with Exacto now. No coding required to get started!
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2">
            <PenSquare className="h-4 w-4" />
            Start Designing
          </Button>
        </Link>
      </section>
      
      <footer className="mt-20 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Exacto. All rights reserved.</p>
      </footer>
    </div>
  );
} 