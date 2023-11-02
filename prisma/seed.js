const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createInitialUsers() {
  try {
    console.log('Starting to create users...');

    await prisma.user.create({
      data: {
        username: 'albert',
        password: 'bertie99',
        name: 'Al Bert',
        location: 'Sidney, Australia',
      },
    });

    await prisma.user.create({
      data: {
        username: 'sandra',
        password: '2sandy4me',
        name: 'Just Sandra',
        location: 'Ain\'t tellin\'',
      },
    });

        await prisma.user.create({
      data: {
        username: 'glamgal',
        password: 'soglam',
        name: 'Joshua',
        location: 'Upper East Side',
      },
    });

    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await prisma.user.findMany(); 

    console.log('Starting to create posts...');

    await prisma.post.create({
      data: {
        authorId: albert.id,
        title: 'First Post',
        content: 'This is my first post. I hope I love writing blogs as much as I love writing them.',
      },
    });

     await prisma.post.create({
      data: {
        authorId: sandra.id,
        title: 'How does this work?',
        content: 'Seriously, does this even do anything?',
      },
    });

     await prisma.post.create({
      data: {
        authorId: glamgal.id,
        title: 'Living the Glam Life',
        content: 'Do you even? I swear that half of you are posing.',
      },
    });


    console.log('Finished creating posts!');
  } catch (error) {
    console.log('Error creating posts!');
    throw error;
  }
}

async function seedDatabase() {
    try{
        await prisma.$connect();
        await createInitialUsers();
        await createInitialPosts();
 
    }catch(error){
        console.error("Error during rebuildDB")
        throw error;
    }
    await prisma.$disconnect();
}



seedDatabase()
  .then(() => {
    console.log("Database rebuild completed");
  })
  .catch((error) => {
    console.error(error, "Error during database rebuild")
  })