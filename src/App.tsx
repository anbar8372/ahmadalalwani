
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';

const Biography = lazy(() => import('./pages/Biography'));
const PoliticalCareer = lazy(() => import('./pages/PoliticalCareer'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Media = lazy(() => import('./pages/Media'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/biography" element={
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <Biography />
            </Suspense>
          } />
          <Route path="/political-career" element={
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <PoliticalCareer />
            </Suspense>
          } />
          <Route path="/achievements" element={
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <Achievements />
            </Suspense>
          } />
          <Route path="/media" element={
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <Media />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <Contact />
            </Suspense>
          } />
          <Route path="/admin" element={
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <AdminPanel />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
