export const renderMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Fenced code blocks (```lang\ncode\n```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, (_, lang, code) => {
      const language = lang || 'code';
      const encoded = code.replace(/"/g, '&quot;').trim();
      const isPreviewable = /^(html|css|javascript|js)$/i.test(lang);
      const isRunnable = /^(javascript|js)$/i.test(lang);
      const previewBtn = isPreviewable
        ? `<button class="code-preview-btn" data-code="${encoded}" onclick="window.__previewCode(this)">Preview</button>`
        : '';
      const runBtn = isRunnable
        ? `<button class="code-run-btn" data-code="${encoded}" onclick="window.__runCode(this)">▶ Run</button>`
        : '';
      return `<div class="code-block"><div class="code-block-header"><span class="code-lang">${language}</span><div class="code-block-actions">${runBtn}${previewBtn}<button class="code-copy-btn" onclick="window.__copyCode(this)" data-code="${encoded}">Copy</button></div></div><pre><code>${code.trim()}</code></pre></div>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Markdown tables
    html = html.replace(/(?:^|\n)((?:\|.+\|\n)+)/gim, (match) => {
      const rows = match.trim().split('\n').filter(r => r.trim());
      if (rows.length < 2) return match;

      const parseCells = (row) => row.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);

      // Check if second row is a separator (---|---|---)
      const isSeparator = (row) => /^\|?[\s-:|]+\|?$/.test(row.trim());
      
      if (!isSeparator(rows[1])) return match;

      const headers = parseCells(rows[0]);
      const dataRows = rows.slice(2).map(parseCells);

      let table = '<table class="md-table"><thead><tr>';
      headers.forEach(h => { table += `<th>${h}</th>`; });
      table += '</tr></thead><tbody>';
      dataRows.forEach(cells => {
        table += '<tr>';
        cells.forEach(c => { table += `<td>${c}</td>`; });
        table += '</tr>';
      });
      table += '</tbody></table>';
      return '\n' + table + '\n';
    });

    // Lists — convert bullet points and wrap consecutive <li> items in <ul>
    html = html.replace(/^\s*[•*-]\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(?:^|\n)(<li>[\s\S]*?<\/li>)(?=\n[^\n<li>]|\n*$)/gi, (match) => {
      return `\n<ul>${match.trim()}</ul>`;
    });

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#8b5cf6;text-decoration:underline;">$1</a>');

    // Paragraphs / Newlines
    html = html.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (/^<\/?(h[1-6]|ul|ol|li|div|pre|blockquote|table|tr|td|th|a)\b/i.test(trimmed)) {
        return line;
      }
      return `<p>${line}</p>`;
    }).join('\n');

    return html;
  };
