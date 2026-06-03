package com.backend.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PaginationUtils {

    private PaginationUtils() {
    }

    /** Spring Data page index: first page = 0. */
    public static Pageable toPageable(int page, int size, String sortBy, String sortDir) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    /** API page number: first page = 1 (converted to 0-based for Spring Data). */
    public static Pageable toPageableOneBased(int page, int size, String sortBy, String sortDir) {
        int zeroBasedPage = page <= 0 ? 0 : page - 1;
        return toPageable(zeroBasedPage, size, sortBy, sortDir);
    }
}
