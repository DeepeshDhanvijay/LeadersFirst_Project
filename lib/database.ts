import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = 'ai_website_generator'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in your environment variables')
  }

  const client = await MongoClient.connect(MONGODB_URI)
  const db = client.db(DB_NAME)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export interface Website {
  _id?: string
  title: string
  description: string
  prompt: string
  websiteType: string
  htmlCode: string
  cssCode: string
  createdAt: Date
  updatedAt: Date
}

export class DatabaseService {
  static async saveWebsite(website: Omit<Website, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { db } = await connectToDatabase()
    const websites = db.collection<Website>('websites')
    
    const result = await websites.insertOne({
      ...website,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any)
    
    return result.insertedId.toString()
  }

  static async getWebsite(id: string): Promise<Website | null> {
    const { db } = await connectToDatabase()
    const websites = db.collection<Website>('websites')
    
    const { ObjectId } = require('mongodb')
    const website = await websites.findOne({ _id: new ObjectId(id) } as any)
    
    return website
  }

  static async getAllWebsites(limit: number = 50): Promise<Website[]> {
    const { db } = await connectToDatabase()
    const websites = db.collection<Website>('websites')
    
    const result = await websites
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    
    return result
  }

  static async deleteWebsite(id: string): Promise<boolean> {
    const { db } = await connectToDatabase()
    const websites = db.collection<Website>('websites')
    
    const { ObjectId } = require('mongodb')
    const result = await websites.deleteOne({ _id: new ObjectId(id) } as any)
    
    return result.deletedCount > 0
  }
}
