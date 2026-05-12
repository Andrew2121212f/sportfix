/**
 * Лёгкий рендерер базового Markdown для статей из Google Sheets.
 *
 * Поддерживает:
 *   - ## заголовок второго уровня → <h2>
 *   - ### заголовок третьего уровня → <h3>
 *   - **жирный** → <strong>
 *   - *курсив* → <em>
 *   - [текст](url) → <a>
 *   - > цитата → <blockquote>
 *   - - список → <ul><li>
 *   - Параграфы — разделяются пустой строкой
 *
 * НЕ поддерживает: вложенные списки, код-блоки, таблицы, изображения внутри текста.
 * Если нужен полноценный Markdown — заменить на react-markdown + remark-gfm.
 *
 * Безопасность: используется ТОЛЬКО для контента из Google Sheets,
 * к которой имеет доступ только команда. HTML-теги из исходника не интерпретируются
 * (строки экранируются перед обработкой).
 */
import { Fragment } from "react";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Парсит inline-форматирование: **bold**, *italic*, [text](url).
 * Возвращает массив React-нод.
 */
function parseInline(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  // Регулярка ловит ссылки, жирный, курсив — в порядке приоритета
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    if (match[1] && match[2]) {
      // [text](url)
      result.push(
        <a
          key={`l-${key++}`}
          href={match[2]}
          target={match[2].startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="text-brand-orange hover:underline"
        >
          {match[1]}
        </a>
      );
    } else if (match[3]) {
      // **bold**
      result.push(<strong key={`b-${key++}`} className="font-bold text-foreground">{match[3]}</strong>);
    } else if (match[4]) {
      // *italic*
      result.push(<em key={`i-${key++}`}>{match[4]}</em>);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  return result;
}

interface ArticleContentProps {
  /** Сырой Markdown-текст из Google Sheets */
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;

  // Разбиваем на блоки по пустым строкам
  const blocks = escapeHtml(content)
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-[15px] text-text-secondary leading-relaxed">
      {blocks.map((block, i) => {
        // Заголовки
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-bold text-foreground mt-6 mb-2">
              {parseInline(block.slice(4))}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-extrabold text-foreground mt-8 mb-3">
              {parseInline(block.slice(3))}
            </h2>
          );
        }

        // Цитата
        if (block.startsWith("> ")) {
          const lines = block.split("\n").map((l) => l.replace(/^>\s?/, ""));
          return (
            <blockquote
              key={i}
              className="border-l-4 border-brand-orange/60 pl-4 italic text-text-secondary/90 my-4"
            >
              {lines.map((l, j) => (
                <Fragment key={j}>
                  {parseInline(l)}
                  {j < lines.length - 1 && <br />}
                </Fragment>
              ))}
            </blockquote>
          );
        }

        // Список
        if (/^[-*]\s+/m.test(block)) {
          const items = block.split("\n").filter((l) => /^[-*]\s+/.test(l));
          return (
            <ul key={i} className="list-disc pl-6 space-y-1.5">
              {items.map((item, j) => (
                <li key={j}>{parseInline(item.replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        // Обычный параграф (несколько строк сливаем в одну)
        const paragraphLines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        return (
          <p key={i}>
            {paragraphLines.map((line, j) => (
              <Fragment key={j}>
                {parseInline(line)}
                {j < paragraphLines.length - 1 && " "}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
