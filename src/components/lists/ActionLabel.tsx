import { TreatingKind, SupportedModule } from "@vk/scrapers";
import { defaultMargin } from "@common/css";
import type { IModuleContext } from "@common/types";
import { useBoxDetail, useTranslation } from "@utils/hooks";
import { h } from "@external/preact";

type ContextType = keyof ITranslation["actionLabel"]["context"];

/**
 * @return Надпись, призывающая к действию — добавлению объекта в списки
 */
export function ActionLabel(): import("preact").JSX.Element | null {
  const detail = useBoxDetail();
  const translation = useTranslation("actionLabel");

  if (detail == null) return null;

  const byContext = (context: ContextType) => {
    const value = translation.context[context];

    return translation.template.replace("{}", value);
  };

  const { invoker, context } = detail;

  const reference =
    invoker != null ? invoker.subType : (context as IModuleContext).module;

  const text = byContext(
    ((): ContextType => {
      switch (reference) {
        case SupportedModule.Group:
          return "group";
        case SupportedModule.Profile:
          return "profile";
        case SupportedModule.Public:
          return "public";

        default: {
          switch (invoker?.kind) {
            case TreatingKind.Bookmark:
              return "bookmark";

            default:
              break;
          }

          return "other";
        }
      }
    })(),
  );

  return <div className={defaultMargin}>{text}</div>;
}
