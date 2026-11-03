Swiftin Global AI Translator 1.0.53 — подготовка сборки Safari для macOS

Это исходный пакет из предоставленного XPI с отдельной конфигурацией manifest.json
для конвертера Safari Web Extension. Добавлен пропущенный в предыдущем архиве файл
src/content/video/pageWorld.js — он необходим для внедрения кода видеоплатформ.

ВАЖНО: это ещё НЕ собранное и НЕ проверенное Safari-приложение. Исходное расширение
содержит Firefox/Chromium WebExtension API и использует background logic, storage,
alarms, contextMenus и declarativeNetRequest. Совместимость этих API и поведения
нужно проверить на Safari после конвертации. Особое внимание — DNR, MAIN world,
видеоплеерам и авторизации.

Сборка без установки Xcode на вашем Mac:
1. Загрузить эту папку в собственный GitHub-репозиторий.
2. Открыть вкладку Actions и запустить workflow “Build Swiftin Safari for macOS”.
3. Скачать artifact Swiftin-Safari-macOS из завершённого запуска.
4. Внутри будет DMG. Это ad-hoc signed сборка для локального тестирования.

Локальная сборка (если Xcode уже установлен):
   ./scripts/build-macos.sh

Ограничения:
- GitHub Actions использует удалённый macOS runner с Xcode; на вашем Mac Xcode не нужен.
- Ad-hoc подпись не является Developer ID подписью и не включает notarization Apple.
  macOS может показать предупреждение Gatekeeper; для публичного распространения
  потребуется Developer ID и notarization.
- Успешная компиляция не доказывает, что все функции расширения работают. Нужно
  вручную проверить перевод обычных страниц и видео на целевом Safari/macOS.
