#!/bin/bash
echo "// rebuild trigger $(date)" >> rebuild.txt
git add rebuild.txt
git commit -m "chore: rebuild trigger $(date)"
git push origin main
echo "✅ Rebuild forçado e sincronizado!"
