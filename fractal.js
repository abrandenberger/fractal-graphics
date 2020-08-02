function generateFractal(position, s, l, depth) { 
  if (depth > 0) {
    // console.log("hi i'm running")
    scene.addSphere(new Sphere(position, l, material='mirror'));

    position_ = Vec3.add(position, s.scale(l*(1+l_ratio))); 
    generateFractal(position_, s, l*l_ratio, depth - 1); 

    if (s.z == 0) {
      s_1 = new Vec3(-s.y, s.x, s.z);
      position_ = Vec3.add(position, s_1.scale(l*(1+l_ratio))); 
      generateFractal(position_, s_1 , l*l_ratio, depth - 1); 

      s_2 = new Vec3(s.y, -s.x, s.z);
      position_ = Vec3.add(position, s_2.scale(l*(1+l_ratio))); 
      generateFractal(position_, s_2, l*l_ratio, depth - 1); 
    }

    if (s.x == 0) {
      s_3 = new Vec3(s.x, s.z, -s.y);
      position_ = Vec3.add(position, s_3.scale(l*(1+l_ratio))); 
      generateFractal(position_, s_3, l*l_ratio, depth - 1); 

      s_4 = new Vec3(s.x, -s.z, s.y);
      position_ = Vec3.add(position, s_4.scale(l*(1+l_ratio))); 
      generateFractal(position_, s_4, l*l_ratio, depth - 1); 
    }

    if (s.y == 0) {
      s_5 = new Vec3(-s.z, s.y, s.x);
      position_ = Vec3.add(position, s_5.scale(l*(1+l_ratio))); 
      generateFractal(position_, s_5, l*l_ratio, depth - 1); 

      s_6 = new Vec3(s.z, s.y, -s.x);
      position_ = Vec3.add(position, s_6.scale(l*(1+l_ratio))); 
      generateFractal(position_, s_6, l*l_ratio, depth - 1); 

    }
  }
}