exports.error404=(req,res,next)=>{
  res.status(404);
res.render("404",{pagetitle: "page not found",
  isLoggedIn: req.isLoggedIn,
  currentPage: "/404"  // Ensure currentPage is set for the 404 page
});
}
