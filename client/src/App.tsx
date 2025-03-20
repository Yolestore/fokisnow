import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Article from "@/pages/article";
import Auth from "@/pages/auth";
import Gallery from "@/pages/gallery";
import AdminDashboard from "@/pages/admin";
import AdminPosts from "@/pages/admin/posts";
import AdminMedia from "@/pages/admin/media";
import AdminComments from "@/pages/admin/comments";
import PostEditor from "@/pages/admin/post-editor";
import Header from "@/components/header";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/article/:id" component={Article} />
          <Route path="/auth" component={Auth} />
          <Route path="/gallery" component={Gallery} />

          {/* Admin Routes */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/posts" component={AdminPosts} />
          <Route path="/admin/posts/new" component={PostEditor} />
          <Route path="/admin/posts/:id" component={PostEditor} />
          <Route path="/admin/media" component={AdminMedia} />
          <Route path="/admin/comments" component={AdminComments} />

          {/* 404 Fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="mt-20 py-8 text-center text-muted-foreground">
        <p>© 2024 FOKIS NOW. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;