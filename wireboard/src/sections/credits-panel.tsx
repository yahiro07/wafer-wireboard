import { useState } from "react";
import { catalog } from "@/base/showcase-entries";
import { Icons } from "@/components/icons";
import { store } from "@/store/store";

type CreditInfo = {
  appName: string;
  imageUrl?: string;
  repositoryUrl: string;
  authorName: string;
  licenseType: string;
  forkedRepositoryUrl?: string;
  forkedAuthor?: string;
  licenseTextUrl?: string;
};

function createCreditEntryInfos(): CreditInfo[] {
  return Object.values(catalog).map((item) => {
    return {
      appName: item.name,
      imageUrl: item.thumbnailUrl,
      repositoryUrl: item.originalRepositoryUrl,
      authorName: item.originalAuthor,
      licenseType: item.license,
      forkedRepositoryUrl: item.forkedRepositoryUrl,
      forkedAuthor: item.forkedAuthor,
      licenseTextUrl: item.licenseTextUrl,
    };
  });
}
const creditEntryInfos = createCreditEntryInfos();

const ExternalLink = ({ url, text }: { url: string; text?: string }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {text ?? url}
    </a>
  );
};

const CreditEntryCard = ({ info }: { info: CreditInfo }) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);
  return (
    <div className="bg-gray-700 text-gray-300">
      <div className="flex-h px-2 gap-1">
        <div className="w-[90px] aspect-[1.5] h-[64px]">
          {info.imageUrl ? (
            <img
              src={info.imageUrl}
              alt={info.appName}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex-c bg-gray-500 text-xs text-gray-700">
              No Thumbnail
            </div>
          )}
        </div>
        <div className="grow">
          {!isOpen && (
            <div className="flex-v p-2" style={{ userSelect: "text" }}>
              <div>{info.appName}</div>
              <div>{info.authorName}</div>
            </div>
          )}
          {isOpen && (
            <div
              className="flex-v p-2"
              style={{ wordBreak: "break-all", userSelect: "text" }}
            >
              <div>
                repository: <ExternalLink url={info.repositoryUrl} />
              </div>
              <div>author: {info.authorName}</div>
              <div>
                license: &nbsp;
                {info.licenseTextUrl ? (
                  <ExternalLink
                    url={info.licenseTextUrl}
                    text={info.licenseType}
                  />
                ) : (
                  info.licenseType
                )}
              </div>
              {false && info.forkedRepositoryUrl && (
                <div className="text-[#888]">
                  forked repository: {info.forkedRepositoryUrl}
                </div>
              )}
              {false && info.forkedAuthor && (
                <div className="text-[#888]">
                  forked author: {info.forkedAuthor}
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className="w-[30px] flex-c text-[20px] h-[64px] cursor-pointer"
          style={{
            transform: isOpen ? "rotate(180deg)" : undefined,
            transition: "transform 0.3s",
          }}
          onClick={toggleOpen}
        >
          <Icons.ChevronDown />
        </div>
      </div>
    </div>
  );
};

export const CreditsPanel = () => {
  return (
    <div className="absolute-full flex-c bg-black/30">
      <div className="w-full max-w-[600px] max-h-[80%] overflow-y-auto bg-gray-800 text-white p-3">
        <div className="flex-h px-2 py-2 font-bold justify-between">
          <div>Credits</div>
          <div
            className="cursor-pointer"
            onClick={() => store.setInfoPanelVisible(false)}
          >
            <Icons.Close />
          </div>
        </div>
        <div className="flex-v gap-2 h-full overflow-y-auto bg-gray-800">
          {creditEntryInfos.map((info) => (
            <CreditEntryCard key={info.appName} info={info} />
          ))}
        </div>
      </div>
    </div>
  );
};
