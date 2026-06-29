const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('e:/work/Automation/CRM/Tagverse_crm/Tagverse_crm/src/app/(crm)');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/var\(--emerald-light\)/g, 'var(--emerald)');
  content = content.replace(/var\(--amber-light\)/g, 'var(--amber)');
  content = content.replace(/var\(--rose-light\)/g, 'var(--rose)');
  content = content.replace(/var\(--blue-light\)/g, 'var(--brand-accent)');
  content = content.replace(/var\(--purple-light\)/g, 'var(--brand-accent)');
  
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.0[0-9]\)/g, 'var(--border)');
  content = content.replace(/rgba\(255,255,255,0\.0[0-9]\)/g, 'var(--border)');
  content = content.replace(/rgba\(239,68,68,0\.1\)/g, 'var(--rose-dim)');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
