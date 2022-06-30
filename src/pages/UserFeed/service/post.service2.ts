import { BaseRecords } from "../../../shared/models/base-records.model";
import { FullPost } from "../models/post.model";
import ApiService from "../../../services/http-client/api.service";
import { inject, singleton } from "tsyringe";
import { GET_POSTS } from "../store/types";
import { BaseQueries } from "../../../shared/models/base-queries";

@singleton()
export default class PostApiService {
  public constructor(@inject("ApiService") private apiService: ApiService) {}

  private readonly postApi: string = "/post/";

  public getPosts(queries?: BaseQueries): Promise<BaseRecords<FullPost>> {
    return this.apiService.post<BaseRecords<FullPost>>(
      this.postApi + GET_POSTS,
      queries
    );
  }
}
