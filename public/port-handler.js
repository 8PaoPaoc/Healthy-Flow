// 在特定端口上隐藏注册表单
document.addEventListener('DOMContentLoaded', function() {
  // 当前端口
  const currentPort = window.location.port;
  
  // 标记body元素，以便CSS可以使用
  document.body.setAttribute('data-port', currentPort);
  
  // 如果是8090端口，仅隐藏注册相关元素
  if (currentPort === '8090') {
    // 更精确地查找包含"用户注册"标题的元素
    const registerTitles = document.querySelectorAll('.card-title, h5, h2');
    
    registerTitles.forEach(element => {
      if (element.textContent.trim() === '用户注册') {
        // 找到父级卡片元素并隐藏
        let parent = element;
        // 向上查找最多5层父元素，寻找card类
        for (let i = 0; i < 5; i++) {
          if (!parent) break;
          if (parent.classList.contains('card')) {
            parent.style.display = 'none';
            console.log('隐藏注册表单卡片', parent);
            break;
          }
          parent = parent.parentElement;
        }
      }
    });
    
    // 仅隐藏特定的注册表单元素，而不是所有表单
    const registerForms = document.getElementById('registration-form');
    if (registerForms) {
      registerForms.style.display = 'none';
      console.log('隐藏注册表单', registerForms);
    }
    
    const registerContainers = document.querySelectorAll('.register-container');
    registerContainers.forEach(container => {
      container.style.display = 'none';
      console.log('隐藏注册容器', container);
    });
  }
}); 