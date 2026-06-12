import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const tasksFilePath = join(process.cwd(), 'public', 'tasks.json')

async function readTasks(): Promise<string[]> {
  try {
    const data = await readFile(tasksFilePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeTasks(tasks: string[]): Promise<void> {
  await writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const tasks = await readTasks()
    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error('Error reading tasks:', error)
    return NextResponse.json({ success: false, tasks: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tasks } = await request.json()
    if (!Array.isArray(tasks)) {
      return NextResponse.json({ success: false, error: 'Invalid tasks format' }, { status: 400 })
    }
    await writeTasks(tasks)
    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error('Error writing tasks:', error)
    return NextResponse.json({ success: false, error: 'Failed to save tasks' }, { status: 500 })
  }
}
