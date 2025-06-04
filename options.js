function traverse(nodes, depth = 0) {
  const select = document.getElementById('folderSelect');
  nodes.forEach(node => {
    if (!node.url) { // folder
      const option = document.createElement('option');
      option.value = node.id;
      option.textContent = '--'.repeat(depth) + ' ' + node.title;
      select.appendChild(option);
      if (node.children) {
        traverse(node.children, depth + 1);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.bookmarks.getTree((nodes) => {
    traverse(nodes);
    chrome.storage.sync.get('sharedFolderId', (data) => {
      if (data.sharedFolderId) {
        document.getElementById('folderSelect').value = data.sharedFolderId;
      }
    });
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    const selectedId = document.getElementById('folderSelect').value;
    chrome.storage.sync.set({ sharedFolderId: selectedId }, () => {
      const status = document.getElementById('status');
      status.textContent = 'Folder saved.';
      setTimeout(() => { status.textContent = ''; }, 1000);
    });
  });
});
