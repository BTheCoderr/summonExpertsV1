import { Client } from '@notionhq/client'

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_SECRET,
})

export interface NotionBlock {
  id: string
  type: string
  content: any
}

export interface NotionPage {
  id: string
  title: string
  content: NotionBlock[]
}

export class NotionService {
  private client: Client

  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_SECRET,
    })
  }

  /**
   * Read content from a Notion page
   */
  async readPage(pageId: string): Promise<NotionPage> {
    try {
      // Get page details
      const page = await this.client.pages.retrieve({ page_id: pageId })
      
      // Get page blocks
      const blocks = await this.client.blocks.children.list({
        block_id: pageId,
      })

      // Extract text content from blocks
      const content = blocks.results.map((block: any) => ({
        id: block.id,
        type: block.type,
        content: this.extractBlockContent(block),
      }))

      return {
        id: pageId,
        title: this.extractPageTitle(page),
        content,
      }
    } catch (error) {
      console.error('Error reading Notion page:', error)
      throw new Error('Failed to read Notion page')
    }
  }

  /**
   * Write content to a Notion page
   */
  async writeToPage(pageId: string, content: string): Promise<void> {
    try {
      await this.client.blocks.children.append({
        block_id: pageId,
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: content,
                  },
                },
              ],
            },
          },
        ],
      })
    } catch (error) {
      console.error('Error writing to Notion page:', error)
      throw new Error('Failed to write to Notion page')
    }
  }

  /**
   * Create a new AI block in Notion
   */
  async createAIBlock(pageId: string, aiResponse: string, prompt: string): Promise<void> {
    try {
      await this.client.blocks.children.append({
        block_id: pageId,
        children: [
          {
            object: 'block',
            type: 'callout',
            callout: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `🤖 AI Response: ${aiResponse}`,
                  },
                },
              ],
              icon: {
                type: 'emoji',
                emoji: '🤖',
              },
              color: 'blue_background',
            },
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `Prompt: ${prompt}`,
                  },
                  annotations: {
                    italic: true,
                    color: 'gray',
                  },
                },
              ],
            },
          },
        ],
      })
    } catch (error) {
      console.error('Error creating AI block:', error)
      throw new Error('Failed to create AI block')
    }
  }

  /**
   * Extract text content from a Notion block
   */
  private extractBlockContent(block: any): string {
    if (!block || !block[block.type]) return ''

    const blockContent = block[block.type]
    
    if (blockContent.rich_text) {
      return blockContent.rich_text
        .map((text: any) => text.plain_text)
        .join('')
    }

    return ''
  }

  /**
   * Extract title from a Notion page
   */
  private extractPageTitle(page: any): string {
    if (page.properties.title?.title) {
      return page.properties.title.title
        .map((text: any) => text.plain_text)
        .join('')
    }
    
    if (page.properties.Name?.title) {
      return page.properties.Name.title
        .map((text: any) => text.plain_text)
        .join('')
    }

    return 'Untitled'
  }

  /**
   * Get all text content from a page for AI processing
   */
  async getPageTextContent(pageId: string): Promise<string> {
    const page = await this.readPage(pageId)
    return page.content
      .map(block => block.content)
      .filter(content => content.trim())
      .join('\n\n')
  }
}

// Export singleton instance
export const notionService = new NotionService() 