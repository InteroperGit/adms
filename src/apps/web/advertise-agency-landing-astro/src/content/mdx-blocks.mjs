// Compile the supported MDX authoring subset into one ordered block stream.
// Reject executable JSX/imports rather than silently discarding article data.
export const blockComponentTypes = Object.freeze({
  ParagraphBlock: 'paragraph',
  HeadingBlock: 'heading',
  OrderedListBlock: 'ordered-list',
  UnorderedListBlock: 'unordered-list',
  TableBlock: 'table',
  ChartBlock: 'chart',
  ImageBlock: 'image',
  ImageGalleryBlock: 'image-gallery',
  VideoBlock: 'video',
  OrderFormBlock: 'order-form',
  QuoteBlock: 'quote',
  FootnoteBlock: 'footnote',
});

/** Plain text preserves soft line breaks as spaces, without dropping markup. */
function plainText(node) {
  if (node.type === 'text') return node.value.replace(/\s*\n\s*/g, ' ');
  if (node.type !== 'paragraph' && node.type !== 'heading') {
    throw new Error(`Unsupported inline Markdown: ${node.type}`);
  }
  return node.children.map((child) => plainText(child)).join('');
}

/** Normalize Markdown and allowlisted JSON components in source order. */
export function collectMdxBlocks(tree) {
  const blocks = [];
  for (const node of tree.children) {
    if (node.type === 'yaml') continue;
    if (node.type === 'heading') {
      if (blocks.at(-1)?.type === 'heading') {
        throw new Error('Headings must be followed by content');
      }
      blocks.push({
        type: 'heading',
        level: node.depth,
        text: plainText(node),
      });
      continue;
    }
    if (node.type === 'paragraph') {
      const previous = blocks.at(-1);
      if (previous?.type === 'paragraph') {
        previous.paragraphs.push(plainText(node));
      } else {
        blocks.push({
          type: 'paragraph', paragraphs: [plainText(node)],
        });
      }
    } else if (node.type === 'list') {
      // The block contract has no start field; reject numbering we cannot keep.
      if (node.ordered && node.start !== 1) {
        throw new Error('Ordered lists must start at one');
      }
      const items = node.children.map((item) => {
        if (item.children.length !== 1 || item.checked != null) {
          throw new Error('Nested lists and task lists need explicit blocks');
        }
        return plainText(item.children[0]);
      });
      blocks.push({
        type: node.ordered ? 'ordered-list' : 'unordered-list',
        items,
      });
    } else if (node.type === 'mdxJsxFlowElement') {
      const type = blockComponentTypes[node.name];
      const attribute = node.attributes[0];
      if (!type || node.children.length || node.attributes.length !== 1
        || attribute.type !== 'mdxJsxAttribute' || attribute.name !== 'block'
        || typeof attribute.value !== 'string') {
        throw new Error('Use an allowlisted block with one JSON string prop');
      }
      const block = JSON.parse(attribute.value);
      if (block.type !== type) {
        throw new Error(`Component ${node.name} requires block type ${type}`);
      }
      blocks.push(block);
    } else {
      throw new Error(`Unsupported article MDX node: ${node.type}`);
    }
  }
  if (blocks.at(-1)?.type === 'heading') {
    throw new Error('A heading must have content');
  }
  return blocks;
}

// ESTree describes fixed property reads only; authored expressions never run.
function propertyRead(object, property) {
  return {
    type: 'MemberExpression',
    computed: false,
    optional: false,
    object: { type: 'Identifier', name: object },
    property: { type: 'Identifier', name: property },
  };
}

function expressionAttribute(name, object, property) {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: `${object}.${property}`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [{
            type: 'ExpressionStatement',
            expression: propertyRead(object, property),
          }],
        },
      },
    },
  };
}

/** Astro exposes the normalized stream through remarkPluginFrontmatter. */
export default function remarkContentBlocks() {
  return (tree, file) => {
    const blocks = collectMdxBlocks(tree);
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.content = blocks;
    // Render MDX through exactly the same component as JSON fallback.
    tree.children = [{
      type: 'mdxJsxFlowElement',
      name: 'ContentBlocks',
      attributes: [
        expressionAttribute('blocks', 'frontmatter', 'content'),
        expressionAttribute('context', 'props', 'context'),
      ],
      children: [],
    }];
  };
}
