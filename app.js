document.addEventListener('DOMContentLoaded', function() {
    // 创建一个全局的弹出窗口容器
    const createPopupContainer = () => {
        const container = document.createElement('div');
        container.id = 'global-popup-container';
        document.body.appendChild(container);
        return container;
    };

    // 创建并显示弹出窗口
    const showPopup = (text, rect) => {
        // 移除可能存在的其他弹出窗口
        hideAllPopups();

        const popup = document.createElement('div');
        popup.className = 'description-popup';
        popup.innerHTML = `<p>${text}</p>`;

        // 计算位置
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        popup.style.left = `${rect.left}px`;
        popup.style.top = `${rect.bottom + scrollTop + 10}px`;

        // 添加到容器
        const container = document.getElementById('global-popup-container') || createPopupContainer();
        container.appendChild(popup);

        // 检查位置并调整
        adjustPopupPosition(popup, rect);

        // 添加动画
        requestAnimationFrame(() => popup.classList.add('active'));
    };

    // 调整弹出窗口位置
    const adjustPopupPosition = (popup, triggerRect) => {
        const popupRect = popup.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 检查底部溢出
        if (popupRect.bottom > window.innerHeight) {
            popup.style.top = `${triggerRect.top + scrollTop - popupRect.height - 10}px`;
        }

        // 检查右侧溢出
        if (popupRect.right > window.innerWidth) {
            popup.style.left = `${window.innerWidth - popupRect.width - 20}px`;
        }
    };

    // 隐藏所有弹出窗口
    const hideAllPopups = () => {
        const container = document.getElementById('global-popup-container');
        if (container) {
            const popups = container.querySelectorAll('.description-popup');
            popups.forEach(popup => {
                popup.classList.remove('active');
                popup.remove();
            });
        }
    };

    // 为所有描述添加事件监听
    const initializeDescriptionHovers = () => {
        const descriptions = document.querySelectorAll('.book-info .description');
        
        descriptions.forEach(desc => {
            desc.addEventListener('mouseenter', (e) => {
                const rect = desc.getBoundingClientRect();
                showPopup(desc.textContent, rect);
            });

            desc.addEventListener('mouseleave', (e) => {
                // 添加延迟以允许鼠标移动到弹出窗口上
                setTimeout(() => {
                    const popup = document.querySelector('.description-popup');
                    if (popup && !popup.matches(':hover')) {
                        hideAllPopups();
                    }
                }, 100);
            });
        });

        // 为 body 添加事件监听，处理弹出窗口的鼠标离开事件
        document.body.addEventListener('mouseover', (e) => {
            const popup = document.querySelector('.description-popup');
            if (popup && !popup.contains(e.target) && !e.target.classList.contains('description')) {
                hideAllPopups();
            }
        });
    };

    // 初始化
    initializeDescriptionHovers();
}); 