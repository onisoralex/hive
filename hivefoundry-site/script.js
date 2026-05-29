const bg = document.querySelector(".hex-bg");

if (bg) {
  // [size (px), left (%), top (%), opacity, rotation (deg)]
  const hexes = [
    [160,  -4,  6, 0.07, 12],
    [90,   14, 48, 0.05, 0],
    [220,  74,  2, 0.05, 22],
    [110,  88, 30, 0.07, 8],
    [70,   48, 84, 0.06, 5],
    [180,  22, 68, 0.05, 28],
    [95,   94, 74, 0.07, 0],
    [130,  58, 50, 0.04, 16],
    [75,    8, 90, 0.06, 10],
    [200,  46, 14, 0.04, 6],
    [55,   84, 93, 0.08, 0],
    [120,  34, 24, 0.05, 20],
    [80,   70, 86, 0.06, 14],
    [145,  -3, 56, 0.05, 8],
    [100, 106, 18, 0.06, 4],
    [65,   62,  7, 0.06, 18],
    [155,  38, 40, 0.03, 30],
    [85,   52, 63, 0.05, 10],
  ];

  hexes.forEach(([size, left, top, op, rot]) => {
    const el = document.createElement("div");
    el.className = "hex";
    el.style.cssText =
      `--size:${size}px;--op:${op};left:${left}%;top:${top}%;transform:rotate(${rot}deg)`;
    bg.appendChild(el);
  });
}
