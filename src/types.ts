export type Blog = {
  title: string;
  pubDate: string;
  description: string;
  link: string;
  content: string;
  tags: string[];
};

export interface CacheData<T> {
  data: T;
  timestamp: number;
}

export type CacheStore = {
  blogs?: CacheData<Blog[]>;
};

export type Sakupi01ZennMCPServer = ReturnType<
  typeof import("./server.ts").createSakupi01ZennMCPServer
>;
