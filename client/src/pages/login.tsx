console.log("Trying to login with:", req.body.email);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: req.body.email,
    password: req.body.password,
  });

  if (authError) {
    console.error("Auth error:", authError);
    return res.status(401).json({ message: "Login echwe", error: authError.message });
  }