/**
 * Material Variant Service
 * 素材变种生成服务 - 使用 Gemini API 实现快速出量素材变种
 *
 * 设计理念：One Click, Infinite Variations
 * - 极简交互：上传 → 选择 → 生成
 * - 智能推荐：AI 分析素材后推荐最佳变种方向
 * - 批量生成：一次生成多个高质量变种
 */

import { GoogleGenAI } from "@google/genai";

// ============================================
// Types & Schemas
// ============================================

/** 变种方向 - 每个方向都是一个独立的创意维度 */
export type VariantDirection =
  | "style"      // 风格变种：写实、插画、扁平、3D
  | "tone"       // 色调变种：暖色、冷色、高对比度、柔和
  | "composition"// 构图变种：特写、全景、侧面、俯视
  | "scene"      // 场景变种：室内、户外、纯色背景
  | "element"    // 元素变种：添加/移除元素
  | "seasonal"   // 季节变种：春夏秋冬、节日主题
  | "text"       // 文字变种：添加营销文案

/** 变种选项详情 */
export interface VariantOption {
  id: string;
  direction: VariantDirection;
  label: string;
  description: string;
  prompt: string;  // Gemini prompt 模板
  icon: string;
}

/** 生成请求 */
export interface GenerateVariantsRequest {
  imageBase64: string;
  mimeType: string;
  selectedOptions: string[];  // option ids
  quantity: number;           // 每个方向生成数量
  aspectRatio?: string;       // 输出比例
}

/** 生成结果 */
export interface VariantResult {
  id: string;
  optionId: string;
  optionLabel: string;
  imageBase64: string;
  prompt: string;
}

/** AI 分析结果 */
export interface MaterialAnalysis {
  subject: string;           // 主体描述
  style: string;             // 当前风格
  colors: string[];          // 主要颜色
  mood: string;              // 情绪氛围
  suggestedDirections: string[];  // 推荐变种方向
}

// ============================================
// Variant Options - 变种选项库
// ============================================

export const VARIANT_OPTIONS: VariantOption[] = [
  // 风格变种
  {
    id: "style-realistic",
    direction: "style",
    label: "写实风格",
    description: "转换为高清写实摄影风格",
    prompt: "Transform this image into a hyper-realistic photographic style with studio lighting, sharp details, and professional color grading. Maintain the original subject and composition.",
    icon: "📸",
  },
  {
    id: "style-illustration",
    direction: "style",
    label: "插画风格",
    description: "转换为精美插画风格",
    prompt: "Transform this image into a beautiful digital illustration style with clean lines, vibrant colors, and artistic shading. Keep the main subject recognizable.",
    icon: "🎨",
  },
  {
    id: "style-flat",
    direction: "style",
    label: "扁平化",
    description: "现代扁平设计风格",
    prompt: "Transform this image into a modern flat design style with bold shapes, minimal gradients, and clean geometric forms. Simplify details while keeping the essence.",
    icon: "🔲",
  },
  {
    id: "style-3d",
    direction: "style",
    label: "3D渲染",
    description: "3D 立体渲染效果",
    prompt: "Transform this image into a 3D rendered style with depth, realistic materials, soft shadows, and a polished CGI look. Keep the subject centered.",
    icon: "🎮",
  },

  // 色调变种
  {
    id: "tone-warm",
    direction: "tone",
    label: "暖色调",
    description: "温暖舒适的橙黄色调",
    prompt: "Adjust the color grading to a warm tone with golden yellows, soft oranges, and cozy amber hues. Keep the composition and subject unchanged.",
    icon: "🌅",
  },
  {
    id: "tone-cool",
    direction: "tone",
    label: "冷色调",
    description: "清新冷静的蓝绿色调",
    prompt: "Adjust the color grading to a cool tone with soft blues, teals, and silver highlights. Maintain the original composition and subject.",
    icon: "❄️",
  },
  {
    id: "tone-high-contrast",
    direction: "tone",
    label: "高对比度",
    description: "强烈视觉冲击的高对比",
    prompt: "Enhance the contrast dramatically with deep blacks, bright highlights, and punchy colors. Make it visually striking while keeping the subject clear.",
    icon: "⚡",
  },
  {
    id: "tone-soft",
    direction: "tone",
    label: "柔和梦幻",
    description: "轻柔梦幻的淡雅色调",
    prompt: "Apply a soft, dreamy aesthetic with muted pastels, gentle light leaks, and a slightly hazy atmosphere. Keep the subject visible but ethereal.",
    icon: "🌸",
  },

  // 构图变种
  {
    id: "comp-closeup",
    direction: "composition",
    label: "特写镜头",
    description: "聚焦主体的特写构图",
    prompt: "Recreate this scene as a dramatic close-up shot, focusing tightly on the main subject. Add depth of field with a blurred background.",
    icon: "🔍",
  },
  {
    id: "comp-wide",
    direction: "composition",
    label: "全景视角",
    description: "展示完整场景的广角",
    prompt: "Recreate this scene as a wide-angle panoramic shot, showing more of the environment around the subject. Maintain the subject as the focal point.",
    icon: "🏞️",
  },
  {
    id: "comp-overhead",
    direction: "composition",
    label: "俯视角度",
    description: "从上往下的俯拍视角",
    prompt: "Recreate this scene from a top-down overhead perspective, as if photographed from directly above. Keep all key elements visible.",
    icon: "🔭",
  },
  {
    id: "comp-low",
    direction: "composition",
    label: "仰视角度",
    description: "从下往上的仰拍视角",
    prompt: "Recreate this scene from a low angle looking upward, making the subject appear more powerful and impressive.",
    icon: "⬆️",
  },

  // 场景变种
  {
    id: "scene-studio",
    direction: "scene",
    label: "纯色背景",
    description: "干净的纯色摄影棚背景",
    prompt: "Place the main subject on a clean, solid white studio background with professional lighting. Remove any distracting elements.",
    icon: "⬜",
  },
  {
    id: "scene-outdoor",
    direction: "scene",
    label: "户外自然",
    description: "自然户外环境场景",
    prompt: "Place the main subject in a beautiful outdoor natural setting with soft natural lighting, greenery, and a pleasant atmosphere.",
    icon: "🌳",
  },
  {
    id: "scene-luxury",
    direction: "scene",
    label: "奢华场景",
    description: "高端奢华的展示环境",
    prompt: "Place the main subject in a luxurious, high-end environment with elegant materials like marble, gold accents, and sophisticated lighting.",
    icon: "💎",
  },
  {
    id: "scene-minimal",
    direction: "scene",
    label: "极简空间",
    description: "简约现代的展示空间",
    prompt: "Place the main subject in a minimalist modern space with clean lines, neutral colors, and thoughtful negative space.",
    icon: "🪴",
  },

  // 季节/节日变种
  {
    id: "seasonal-spring",
    direction: "seasonal",
    label: "春季主题",
    description: "清新春日氛围",
    prompt: "Add spring elements to this image: cherry blossoms, fresh green leaves, soft pink and green colors, morning light, and a fresh, hopeful atmosphere.",
    icon: "🌸",
  },
  {
    id: "seasonal-summer",
    direction: "seasonal",
    label: "夏季主题",
    description: "活力夏日氛围",
    prompt: "Add summer elements to this image: bright sunshine, tropical colors, beach vibes, vibrant energy, and warm golden light.",
    icon: "☀️",
  },
  {
    id: "seasonal-autumn",
    direction: "seasonal",
    label: "秋季主题",
    description: "温馨秋日氛围",
    prompt: "Add autumn elements to this image: falling leaves, warm orange and brown tones, cozy atmosphere, and soft golden hour lighting.",
    icon: "🍂",
  },
  {
    id: "seasonal-winter",
    direction: "seasonal",
    label: "冬季主题",
    description: "温暖冬日氛围",
    prompt: "Add winter elements to this image: soft snow, cozy warm lighting, cool blue tones with warm highlights, and a festive comfortable atmosphere.",
    icon: "❄️",
  },
  {
    id: "seasonal-cny",
    direction: "seasonal",
    label: "春节主题",
    description: "喜庆中国年氛围",
    prompt: "Add Chinese New Year elements: red and gold colors, lanterns, traditional patterns, festive decorations, and a celebratory atmosphere.",
    icon: "🧧",
  },
];

/** 按方向分组的选项 */
export const VARIANT_OPTIONS_BY_DIRECTION = VARIANT_OPTIONS.reduce((acc, opt) => {
  if (!acc[opt.direction]) acc[opt.direction] = [];
  acc[opt.direction].push(opt);
  return acc;
}, {} as Record<VariantDirection, VariantOption[]>);

/** 方向元数据 */
export const DIRECTION_META: Record<VariantDirection, { label: string; icon: string; description: string }> = {
  style: { label: "风格变种", icon: "🎨", description: "改变整体视觉风格" },
  tone: { label: "色调变种", icon: "🌈", description: "调整色彩氛围" },
  composition: { label: "构图变种", icon: "📐", description: "改变拍摄角度和构图" },
  scene: { label: "场景变种", icon: "🏠", description: "更换背景环境" },
  seasonal: { label: "季节主题", icon: "🗓️", description: "添加季节或节日元素" },
  element: { label: "元素变种", icon: "✨", description: "添加或移除元素" },
  text: { label: "文字变种", icon: "📝", description: "添加营销文案" },
};

// ============================================
// Core Service Functions
// ============================================

/**
 * 创建 Gemini 客户端
 */
function createClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * 分析素材内容
 * 通过 AI 分析素材，了解主体、风格、色调，并推荐最佳变种方向
 */
export async function analyzeMaterial(
  imageBase64: string,
  mimeType: string
): Promise<MaterialAnalysis> {
  const client = createClient();

  const prompt = `Analyze this marketing material image and provide:
1. Subject: What is the main subject/product in this image?
2. Style: What visual style is this (photography, illustration, 3D, etc.)?
3. Colors: List the 3 main colors used
4. Mood: What emotion/atmosphere does it convey?
5. Suggestions: Which 3 variant directions would work best? Choose from: style, tone, composition, scene, seasonal

Respond in JSON format:
{
  "subject": "description of main subject",
  "style": "current style",
  "colors": ["color1", "color2", "color3"],
  "mood": "emotional atmosphere",
  "suggestedDirections": ["direction1", "direction2", "direction3"]
}`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // 解析 JSON 响应
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      subject: "Unknown",
      style: "Unknown",
      colors: [],
      mood: "Unknown",
      suggestedDirections: ["style", "tone", "scene"],
    };
  }

  try {
    return JSON.parse(jsonMatch[0]) as MaterialAnalysis;
  } catch {
    return {
      subject: "Unknown",
      style: "Unknown",
      colors: [],
      mood: "Unknown",
      suggestedDirections: ["style", "tone", "scene"],
    };
  }
}

/**
 * 生成单个变种
 * 使用 Gemini Image API 生成变种图片
 */
async function generateSingleVariant(
  client: GoogleGenAI,
  imageBase64: string,
  mimeType: string,
  option: VariantOption,
  aspectRatio: string = "1:1"
): Promise<{ imageBase64: string; prompt: string } | null> {
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: [
        {
          role: "user",
          parts: [
            { text: option.prompt },
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        // @ts-expect-error - imageConfig 是新增的配置
        imageConfig: {
          aspectRatio,
        },
      },
    });

    // 从响应中提取图片
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      // @ts-expect-error - inlineData 类型
      if (part.inlineData?.data) {
        return {
          // @ts-expect-error - inlineData 类型
          imageBase64: part.inlineData.data,
          prompt: option.prompt,
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`Failed to generate variant ${option.id}:`, error);
    return null;
  }
}

/**
 * 批量生成变种
 * 根据选择的变种方向批量生成多个变种图片
 */
export async function generateVariants(
  request: GenerateVariantsRequest
): Promise<VariantResult[]> {
  const client = createClient();
  const results: VariantResult[] = [];

  // 获取选中的选项
  const selectedOptions = request.selectedOptions
    .map(id => VARIANT_OPTIONS.find(opt => opt.id === id))
    .filter((opt): opt is VariantOption => opt !== undefined);

  if (selectedOptions.length === 0) {
    throw new Error("No valid options selected");
  }

  // 并发控制 - 每次最多 3 个并发请求
  const CONCURRENCY = 3;
  const tasks: Array<{ option: VariantOption; index: number }> = [];

  // 为每个选项创建多个任务
  for (const option of selectedOptions) {
    for (let i = 0; i < request.quantity; i++) {
      tasks.push({ option, index: i });
    }
  }

  // 分批执行
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    const batchPromises = batch.map(async ({ option, index }) => {
      const result = await generateSingleVariant(
        client,
        request.imageBase64,
        request.mimeType,
        option,
        request.aspectRatio
      );

      if (result) {
        return {
          id: `${option.id}-${index}-${Date.now()}`,
          optionId: option.id,
          optionLabel: option.label,
          imageBase64: result.imageBase64,
          prompt: result.prompt,
        };
      }
      return null;
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter((r): r is VariantResult => r !== null));
  }

  return results;
}

/**
 * 获取所有变种选项
 */
export function getVariantOptions(): VariantOption[] {
  return VARIANT_OPTIONS;
}

/**
 * 根据方向获取变种选项
 */
export function getVariantOptionsByDirection(direction: VariantDirection): VariantOption[] {
  return VARIANT_OPTIONS_BY_DIRECTION[direction] || [];
}
