import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './modules/users/user.entity';
import { Category } from './modules/categories/category.entity';
import { Item } from './modules/items/item.entity';
import { UserRole } from './common/enums/user.enum';
import { ItemCondition } from './common/enums/item.enum';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Criar usuário admin
    const userRepo = dataSource.getRepository(User);
    const adminExists = await userRepo.findOne({
      where: { email: 'admin@auction.com' },
    });

    if (!adminExists) {
      const admin = userRepo.create({
        email: 'admin@auction.com',
        name: 'Administrador',
        password: await bcrypt.hash('admin123', 10),
        role: UserRole.ADMIN,
      });
      await userRepo.save(admin);
      console.log('✅ Admin criado: admin@auction.com / admin123');
    }

    // Criar usuários participantes
    const participantEmails = [
      'joao@email.com',
      'maria@email.com',
      'pedro@email.com',
    ];

    for (const email of participantEmails) {
      const exists = await userRepo.findOne({ where: { email } });
      if (!exists) {
        const user = userRepo.create({
          email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          password: await bcrypt.hash('senha123', 10),
          role: UserRole.PARTICIPANT,
        });
        await userRepo.save(user);
        console.log(`✅ Participante criado: ${email} / senha123`);
      }
    }

    // Criar categorias
    const categoryRepo = dataSource.getRepository(Category);
    const categories = [
      { name: 'Imóveis', description: 'Casas, apartamentos, terrenos e propriedades' },
      { name: 'Eletrônicos', description: 'Smartphones, notebooks, tablets e mais' },
      { name: 'Veículos', description: 'Carros, motos e veículos diversos' },
      { name: 'Antiguidades', description: 'Objetos raros e colecionáveis' },
      { name: 'Arte', description: 'Pinturas, esculturas e obras de arte' },
      { name: 'Joias', description: 'Jóias, relógios e acessórios de luxo' },
    ];

    const savedCategories = [];
    for (const cat of categories) {
      const exists = await categoryRepo.findOne({ where: { name: cat.name } });
      if (!exists) {
        const category = categoryRepo.create(cat);
        const saved = await categoryRepo.save(category);
        savedCategories.push(saved);
        console.log(`✅ Categoria criada: ${cat.name}`);
      } else {
        savedCategories.push(exists);
      }
    }

    // Criar itens de exemplo
    const itemRepo = dataSource.getRepository(Item);
    const items = [
      {
        name: 'Casa na Praia - Vista Mar',
        description: 'Linda casa com 3 quartos, 2 banheiros, vista panorâmica para o mar.',
        condition: ItemCondition.EXCELLENT,
        initialValue: 500000,
        minimumIncrement: 10000,
        categoryId: savedCategories.find(c => c.name === 'Imóveis')?.id,
      },
      {
        name: 'iPhone 15 Pro Max 256GB',
        description: 'Smartphone Apple iPhone 15 Pro Max, 256GB, Titânio Natural, novo na caixa.',
        condition: ItemCondition.NEW,
        initialValue: 7000,
        minimumIncrement: 100,
        categoryId: savedCategories.find(c => c.name === 'Eletrônicos')?.id,
      },
      {
        name: 'MacBook Pro 16" M3 Max',
        description: 'Notebook Apple MacBook Pro 16", M3 Max, 64GB RAM, 1TB SSD, novo.',
        condition: ItemCondition.NEW,
        initialValue: 25000,
        minimumIncrement: 500,
        categoryId: savedCategories.find(c => c.name === 'Eletrônicos')?.id,
      },
      {
        name: 'Toyota Corolla 2023',
        description: 'Veículo Toyota Corolla XEI 2023, automático, completo, 15.000 km.',
        condition: ItemCondition.EXCELLENT,
        initialValue: 120000,
        minimumIncrement: 2000,
        categoryId: savedCategories.find(c => c.name === 'Veículos')?.id,
      },
      {
        name: 'Relógio Rolex Submariner',
        description: 'Relógio Rolex Submariner Date, aço inoxidável, automático, com certificado.',
        condition: ItemCondition.EXCELLENT,
        initialValue: 80000,
        minimumIncrement: 2000,
        categoryId: savedCategories.find(c => c.name === 'Joias')?.id,
      },
      {
        name: 'Pintura Tarsila do Amaral (Reprodução)',
        description: 'Reprodução de alta qualidade de obra de Tarsila do Amaral, moldura premium.',
        condition: ItemCondition.NEW,
        initialValue: 5000,
        minimumIncrement: 200,
        categoryId: savedCategories.find(c => c.name === 'Arte')?.id,
      },
      {
        name: 'Mesa Antiga Vitoriana',
        description: 'Mesa de jantar vitoriana em madeira maciça, restaurada, séc. XIX.',
        condition: ItemCondition.GOOD,
        initialValue: 15000,
        minimumIncrement: 500,
        categoryId: savedCategories.find(c => c.name === 'Antiguidades')?.id,
      },
      {
        name: 'Apartamento 2 Quartos Centro',
        description: 'Apartamento 70m², 2 quartos, suite, vaga coberta, localização privilegiada.',
        condition: ItemCondition.GOOD,
        initialValue: 350000,
        minimumIncrement: 5000,
        categoryId: savedCategories.find(c => c.name === 'Imóveis')?.id,
      },
    ];

    for (const itemData of items) {
      const exists = await itemRepo.findOne({ where: { name: itemData.name } });
      if (!exists) {
        const item = itemRepo.create({
          ...itemData,
          currentValue: itemData.initialValue,
        });
        await itemRepo.save(item);
        console.log(`✅ Item criado: ${itemData.name}`);
      }
    }

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('   Admin: admin@auction.com / admin123');
    console.log('   Participante: joao@email.com / senha123');
    console.log('   Participante: maria@email.com / senha123');
    console.log('   Participante: pedro@email.com / senha123');
    console.log('\n🚀 Inicie o servidor com: npm run start:dev');
    console.log('📚 Acesse a documentação: http://localhost:3000/api/docs\n');

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
  } finally {
    await app.close();
  }
}

seed();
