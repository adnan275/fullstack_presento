import prisma from "./prisma/client.js";

async function main(){
  const p = await prisma.product.create({
    data: {
      name: "Couple Mugs (Mr & Mrs)",
      description: "Two souls, one story. Celebrate love with our Mr. & Mrs. couple mugs – the perfect wedding gift for a perfect pair! 💕☕",
      price: 300,
      stock: 50,
      category: "Home & Kitchen",
      imageUrl: "https://res.cloudinary.com/dnro94yby/image/upload/v1763236522/Screenshot_2025-11-15_at_18.55.56_qmyetj.png"
    }
  });
  console.log("Inserted:", p);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(()=>process.exit());
